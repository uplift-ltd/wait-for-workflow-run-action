import * as core from '@actions/core'
import {getRunsForWorkflow} from './runs'
import {OctokitInstance} from './types'

interface ShouldCancelOptions {
  octokit: OctokitInstance
  workflow_id: number
  sha: string
  dependentCount: number
}

type ShouldCancelResult = boolean

export async function shouldCancel({
  octokit,
  workflow_id,
  sha,
  dependentCount
}: ShouldCancelOptions): Promise<ShouldCancelResult> {
  const runs = await getRunsForWorkflow({octokit, workflow_id, sha})

  core.debug(`Found ${runs.length} run(s) for this workflow.`)

  const cancel = runs.length < dependentCount

  if (cancel) {
    core.info(
      `This is not the last workflow that will be triggered. Cancelling.`
    )
  }

  return cancel
}
