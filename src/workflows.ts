import yaml from 'yaml'
import * as github from '@actions/github'
import * as core from '@actions/core'
import {ContentFile, OctokitInstance} from './types'

/**
 * Get Dependent Workflows
 */
interface GetDependentWorkflowsOptions {
  octokit: OctokitInstance
  workflow_id: number
}

type GetDependentWorkflowsResult = string[]

// returns the name of the workflows as defined in the yaml file
export async function getDependentWorkflows({
  octokit,
  workflow_id
}: GetDependentWorkflowsOptions): Promise<GetDependentWorkflowsResult> {
  core.info(`Getting workflow dependencies for workflow ${workflow_id}`)

  // get the path to the workflow file
  const {
    data: {path}
  } = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}',
    {
      ...github.context.repo,
      workflow_id
    }
  )

  // get the workflwo file content
  const {data: fileData} = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      ...github.context.repo,
      ref: github.context.ref,
      path
    }
  )

  const {content} = fileData as ContentFile

  // get the workflows out from the file
  const {
    on: {
      workflow_run: {workflows}
    }
  } = yaml.parse(Buffer.from(content, 'base64').toString())

  core.debug(`Workflow dependencies: ${workflows}`)

  return workflows
}
