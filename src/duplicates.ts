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

export async function getWillHaveOtherRuns({
  octokit,
  workflow_id,
  sha,
  dependentCount
}: ShouldCancelOptions): Promise<ShouldCancelResult> {
  const runs = await getRunsForWorkflow({octokit, workflow_id, sha})

  core.debug(
    `Found ${runs.length} run(s) for this workflow id (${workflow_id}) and sha (${sha}).`
  )

  return runs.length < dependentCount
}
