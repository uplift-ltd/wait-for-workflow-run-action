import * as github from '@actions/github'
import {OctokitInstance, WorkflowRun} from './types'

/**
 * Get Runs for Worfklows (by name)
 */
interface GetRunsForWorkflowNamesOptions {
  octokit: OctokitInstance
  workflows: string[]
  sha: string
}

type GetRunsForWorkflowNamesResult = WorkflowRun[]

export async function getRunsForWorkflowNames({
  octokit,
  workflows,
  sha
}: GetRunsForWorkflowNamesOptions): Promise<GetRunsForWorkflowNamesResult> {
  const {
    data: {workflow_runs}
  } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
    ...github.context.repo,
    per_page: 100
  })

  return workflow_runs.filter(
    run => workflows.includes(run.name) && run.head_sha === sha
  )
}

/**
 * Get Runs for Worfklow (by id)
 */
interface GetRunsForWorkflowOptions {
  octokit: OctokitInstance
  workflow_id: number
  sha: string
}

type GetRunsForWorkflowResult = WorkflowRun[]

export async function getRunsForWorkflow({
  octokit,
  workflow_id,
  sha
}: GetRunsForWorkflowOptions): Promise<GetRunsForWorkflowResult> {
  const {
    data: {workflow_runs}
  } = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
    {
      ...github.context.repo,
      workflow_id,
      per_page: 100
    }
  )

  return workflow_runs.filter(run => run.head_sha === sha)
}
