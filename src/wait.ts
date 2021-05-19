import * as core from '@actions/core'
import * as github from '@actions/github'
import {getDependentWorkflows} from './workflows'
import {getRunsForWorkflowNames} from './runs'
import {Inputs, Outputs} from './types'
import {formatRunName} from './utils'
import {getWillHaveOtherRuns} from './duplicates'
import {cancelCurrentRun} from './cancel'

export async function wait({
  token,
  sha,
  cancelWorkflow
}: Inputs): Promise<Outputs> {
  const octokit = github.getOctokit(token)

  core.info(`sha: ${sha}`)

  const {
    data: {workflow_id}
  } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    ...github.context.repo,
    run_id: github.context.runId
  })

  const workflows = await getDependentWorkflows({octokit, workflow_id})

  const willHaveOtherRuns = await getWillHaveOtherRuns({
    octokit,
    workflow_id,
    sha,
    dependentCount: workflows.length
  })

  if (willHaveOtherRuns) {
    core.info(`This is not the last run that will be triggered. Cancelling.`)
    if (cancelWorkflow) {
      await cancelCurrentRun({octokit})
    }
    return {result: 'cancelled'}
  }

  const runs = await getRunsForWorkflowNames({octokit, workflows, sha})

  for (const run of runs) {
    core.info(`${formatRunName(run)}: ${run.conclusion || 'pending'}`)
  }

  const hasPendingRuns = runs.some(run => !run.conclusion)

  if (hasPendingRuns) {
    core.info(
      `Some runs are still pending. There should be another run triggered. Cancelling.`
    )
    if (cancelWorkflow) {
      await cancelCurrentRun({octokit})
    }
    return {result: 'cancelled'}
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
