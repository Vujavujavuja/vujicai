DoorDash, Cursor, Airbnb, Siemens and Lindy all have one quiet thing in common this month. They are all running Open Weight AI models.

Even though these Open Weight models are almost in all cases Chinese made, the reason has nothing to do with politics. It has to do with a couple of different axes coming together at the right time:

- The frontier SOTA models are becoming excruciatingly expensive;
- With the recent release of Kimi K3 it seems that they have caught up with the capabilities of closed models;
- Lastly, the main benefit Open Weight presents: self-hosting. The data you give models that run on your own infra stays fully with you, so compliance is far more manageable.

The numbers are there to back these claims up. On OpenRouter, Chinese models have held 30% of enterprise tokens almost every week since the beginning of February, and have hit a new all-time high of 46% just recently. In 2025 those numbers were sitting at less than 5%.

![Line chart titled "Chinese AI model usage by U.S. companies has risen significantly during 2026", showing the share of tokens from U.S. companies on OpenRouter that went to Chinese models, climbing from under 5% in early 2025 to a high near 46% by mid-2026. Source: OpenRouter.](/thoughts/choosing-an-ai-model-is-a-governance-question/openrouter-chinese-model-share.webp)

DoorDash's CTO on the Moonshot model behind its new CLI: better quality, cheaper cost. Lindy reportedly dropped Anthropic's tools altogether for DeepSeek V4.

And now Kimi K3, with its 2.8 trillion parameters, is matching the capabilities of Fable 5 and GPT-5.6 Sol at a fraction of the cost. The US labs are responding to this release in different ways:

- Anthropic first planned to cut Fable 5 from subscription plans, but they have changed their mind on that idea three times in the past few weeks;
- OpenAI shipped a $1-per-million tier to hold the high volume work.

The thing some people miss on this issue with Kimi K3 is that its weights haven't been released yet. They are still pending, with China hosting its big three frontier labs in a meeting to try and slow or stop the open sourcing of these powerful models. Adoption of K3 mainly runs through their API, which eliminates the governance and compliance benefit that has helped Open Weight models in the first place.

For me the main takeaway is this, for anyone or any company choosing a model in 2026: leaderboards of model capabilities have become far less useful than they were at the start. Almost no one will notice a difference of 0.5% on a benchmark that measures performance on one really specific task. Choosing your model now is becoming more of a governance question, day by day.
