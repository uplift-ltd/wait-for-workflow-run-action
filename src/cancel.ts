import * as core from '@actions/core'
import * as github from '@actions/github'
import {OctokitInstance} from './types'

interface CancelCurrentRunOptions {
  octokit: OctokitInstance
}

export const cancelCurrentRun = async ({
  octokit
}: CancelCurrentRunOptions): Promise<void> => {
  core.info(`Canceling workflow because cancelWorkflow options is enabled.`)
  await octokit.request(
    'POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel',
    {
      ...github.context.repo,
      run_id: github.context.runId
    }
  )
}
