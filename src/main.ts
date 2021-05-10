import * as core from '@actions/core'
import {Inputs} from './types'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput('github-token', {required: true}),
      sha: core.getInput('github-token', {required: true}),
      delay: Number(core.getInput('delay', {required: false})),
      timeout: Number(core.getInput('timeout', {required: false})),
      cancelledAsSuccess:
        core.getInput('cancelled-as-success', {required: false}) === 'true'
    }

    const outputs = await wait(inputs)

    core.setOutput('cancelled', outputs.cancelled)
    core.setOutput('success', outputs.success)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
