import {getOctokit} from '@actions/github'
import {components} from '@octokit/openapi-types'

export type OctokitInstance = ReturnType<typeof getOctokit>

export interface Inputs {
  token: string
  sha: string
  delay: number
  timeout: number
  cancelledAsSuccess: boolean
}

export interface Outputs {
  cancelled: boolean
  success: boolean
}

export type WorkflowRun = components['schemas']['workflow-run']

export type ContentFile = components['schemas']['content-file']
