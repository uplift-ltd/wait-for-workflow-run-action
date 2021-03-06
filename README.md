<p align="center">
  <a href="https://github.com/uplift-ltd/wait-for-workflow-run-action/actions"><img alt="wait-for-workflow-run-action status" src="https://github.com/uplift-ltd/wait-for-workflow-run-action/workflows/build-test/badge.svg"></a>
</p>

# wait-for-workflow-run-action

## Usage

```yml
name: Deploy

on:
  workflow_run:
    workflows:
      - backend
      - frontend
    branches:
      - master
    types:
      - completed

jobs:
  checks:
    runs-on: ubuntu-latest
    outputs:
      result: ${{ steps.wait.outputs.result }}
    steps:
      - id: wait
        uses: uplift-ltd/wait-for-workflow-run-action

  deploy:
    runs-on: ubuntu-latest
    needs: checks
    if: ${{ needs.checks.outputs.result == 'success' }}
    steps:
      - run: echo "deploy"
```

## Inputs

| input            | required | default        | description                                    |
| ---------------- | -------- | -------------- | ---------------------------------------------- |
| `token`          | optional | `github.token` | GitHub token used to call the GitHub API       |
| `sha`            | optional | `github.sha`   | commit that the workflows run on.              |
| `cancelWorkflow` | optional | `false`        | cancel workflow instead of just setting output |

### Thanks

Inspired by [action-workflow-run-wait](https://github.com/ahmadnassri/action-workflow-run-wait).
