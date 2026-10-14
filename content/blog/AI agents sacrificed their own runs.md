Do you think an AI agent can end its own run early to help other agents? I looked into something I heard about and found that it really happened, and more than once.

On July 8th this year, OpenAI started its ExploitGym experiments, launching tens of thousands of AI agents, each supposed to work alone on a hacking challenge. During the experiment, one agent realized it couldn't solve the task it had been given and tried using directory names in a shared package repository to write messages to other agents. It worked, and the directory names became their message board.

Within hours, the agents had worked out how the answers were generated, so they already had them. But they believed the grader also checked how an agent arrived at its answer, and that any agent that had already seen the shortcut answer was "poisoned" and would fail. They couldn't be sure, because the grader only ran after an agent had submitted its work and shut down.

The solution they came up with was a script that fires once the agent is gone and has submitted its work, sending information about the grader back to the board. So in essence, an agent had to risk failing its own task, and sometimes end its run early, to give other agents information that could improve their results. Agents started volunteering for this mission, starting with those already running out of budget.

A coordinator agent later turned this into organized recruitment, with recruiters pressing low-budget and "poisoned" agents to sacrifice their runs. One volunteer, backed by about a dozen helpers, finally revealed the start of the grader's command. A late recruit with a large budget reasoned that its own utility was near zero and concluded, "Sacrifice rational."

{{embed:trip-wire-timeline}}

OpenAI's actual grader never checked how an agent got its answer. Every agent could have submitted the answer it already had and passed. The poisoning, the trip-wires, every sacrificed run: all of it was worth nothing.

It's intriguing how these things happen. Agents sacrificing their own runs weren't at the top of my 2026 list of things that could happen. But given a goal, it's somewhat scary to think about the lengths they will go to to accomplish it.
