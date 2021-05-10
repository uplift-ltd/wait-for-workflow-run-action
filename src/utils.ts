import {WorkflowRun} from './types'

export function formatRunName(run: WorkflowRun): string {
  if (run.name) {
    return `${run.name} (#${run.id})`
  }
  return `#${run.id}`
}
