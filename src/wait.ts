import * as core from '@actions/core'
import * as github from '@actions/github'
import {getDependentWorkflows} from './workflows'
import {getRunsForWorkflowNames} from './runs'
import {Inputs, Outputs} from './types'
import {formatRunName} from './utils'
import {shouldCancel} from './duplicates'

export async function wait({
  token,
  sha,
  cancelWorkflow
}: Inputs): Promise<Outputs> {
  const octokit = github.getOctokit(token)

  const {
    data: {workflow_id}
  } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    ...github.context.repo,
    run_id: github.context.runId
  })

  const workflows = await getDependentWorkflows({octokit, workflow_id})

  if (
    await shouldCancel({
      octokit,
      workflow_id,
      sha,
      dependentCount: workflows.length
    })
  ) {
    if (cancelWorkflow) {
      await octokit.request(
        'POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel',
        {
          ...github.context.repo,
          run_id: github.context.runId
        }
      )
    }
    return {result: 'cancelled'}
  }

  const runs = await getRunsForWorkflowNames({octokit, workflows, sha})

  for (const run of runs) {
    core.info(`${formatRunName(run)}: ${run.conclusion || 'pending'}`)
  }

  if (runs.some(run => run.conclusion !== 'success')) {
    throw new Error(
      `Some runs didn't succeed: ${runs
        .filter(run => run.conclusion === 'failed')
        .map(formatRunName)
        .join(', ')}`
    )
  }

  return {
    result: 'success'
  }
}
