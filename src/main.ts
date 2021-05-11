import * as core from '@actions/core'
import {Inputs, Outputs} from './types'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput('token', {required: true}),
      sha: core.getInput('sha', {required: true}),
      cancelWorkflow:
        core.getInput('cancelWorkflow', {required: false}) === 'true'
    }

    const outputs = await wait(inputs)

    core.setOutput('result', outputs.result)
  } catch (error) {
    const failedResult: Outputs['result'] = 'failed'
    core.setOutput('result', failedResult)
    core.setFailed(error.message)
  }
}

run()
