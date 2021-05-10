import core from '@actions/core'
import {getRunsForWorkflow} from './runs'
import {OctokitInstance} from './types'

interface ShouldCancelOptions {
  octokit: OctokitInstance
  workflow_id: number
}

type ShouldCancelResult = boolean

export async function shouldCancel({
  octokit,
  workflow_id
}: ShouldCancelOptions): Promise<ShouldCancelResult> {
  const runs = await getRunsForWorkflow({octokit, workflow_id})

  core.debug(`Found ${runs.length} run(s) for this workflow.`)

  const cancel = runs.length >= 1

  if (cancel) {
    core.info(`Found other runs for this workflow. Canceling.`)
  }

  return cancel
}
