import {getOctokit} from '@actions/github'
import type {components} from '@octokit/openapi-types'

export type OctokitInstance = ReturnType<typeof getOctokit>

export interface Inputs {
  token: string
  sha: string
  cancelWorkflow: boolean
}

export interface Outputs {
  result: 'success' | 'failed' | 'cancelled'
}

export type WorkflowRun = components['schemas']['workflow-run']

// NOTE: not sure why, but 'display_title' is not returned from octokit
export type OctokitWorkflowRun = Omit<WorkflowRun, 'display_title'>

export type ContentFile = components['schemas']['content-file']
