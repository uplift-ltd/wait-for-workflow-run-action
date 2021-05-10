import core from '@actions/core'
import {getOctokit, context} from '@actions/github'
import waait from 'waait'
import {getDependentWorkflows} from './workflows'
import {getRunsForWorkflowNames} from './runs'
import {Inputs, Outputs} from './types'
import {formatRunName} from './utils'
import {shouldCancel} from './duplicates'

export async function wait({
  token,
  sha,
  delay,
  timeout,
  cancelledAsSuccess
}: Inputs): Promise<Outputs> {
  const octokit = getOctokit(token)

  const {
    data: {workflow_id}
  } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    ...context.repo,
    run_id: context.runId
  })

  if (await shouldCancel({octokit, workflow_id})) {
    await octokit.request(
      'POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel',
      {
        ...context.repo,
        run_id: context.runId
      }
    )
    return {cancelled: true, success: false}
  }

  const workflows = await getDependentWorkflows({octokit, workflow_id})

  const successfulConclusions = ['success']
  if (cancelledAsSuccess) successfulConclusions.push('cancelled')

  let timer = 0
  let runs = await getRunsForWorkflowNames({octokit, workflows, sha})

  while (
    runs.find(
      run => run.conclusion && !successfulConclusions.includes(run.conclusion)
    )
  ) {
    timer += delay

    if (runs.some(run => run.conclusion === 'failed')) {
      throw new Error(
        `Some runs failed: ${runs
          .filter(run => run.conclusion === 'failed')
          .map(formatRunName)
          .join(', ')}`
      )
    }

    if (timer >= timeout) {
      throw new Error(
        `Timeout reached. Pending runs: ${runs
          .filter(run => !run.conclusion)
          .map(formatRunName)
          .join(', ')}`
      )
    }

    core.info(`Pending runs. Trying again in: ${delay}ms`)

    await waait(delay)

    runs = await getRunsForWorkflowNames({octokit, workflows, sha})
  }

  for (const run of runs) {
    core.info(`${formatRunName(run)}: ${run.conclusion || 'pending'}`)
  }

  return {
    cancelled: false,
    success: true
  }
}
