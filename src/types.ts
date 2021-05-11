import {getOctokit} from '@actions/github'
import {components} from '@octokit/openapi-types'

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

export type ContentFile = components['schemas']['content-file']
