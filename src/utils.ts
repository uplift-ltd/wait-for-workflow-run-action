import {OctokitWorkflowRun} from './types'

export function formatRunName(run: OctokitWorkflowRun): string {
  if (run.name) {
    return `${run.name} (#${run.id})`
  }
  return `#${run.id}`
}
