What is the most often missed issue with agentic AI coding? We often assume it is something to do with the quality of the code, but it is often not that simple.

With the advancements in agentic AI coding capabilities, the code it writes is often really good. A few years ago, if you were to write code using a large language model, it would make mistakes that were obvious, the kind that would break the application, or the code would simply not run.

That is not the case anymore. Code generated with agentic AI is often fully runnable on the first try.

But the issue I noticed this past weekend, while working on a side project of mine, is that it often doesn't handle errors the way it is supposed to. And I don't mean that the errors are generic. I mean that if you were using the application, you wouldn't even notice that an error is happening.

For example, I was implementing a third-party flight scanner API, and of course I asked Claude Code to implement it. I was testing it with a few flight numbers and it was working on some, returning some values, but the values it returned looked somewhat weird. After I looked under the hood, I saw the call to the API, and that if the call failed, it would mock up data and return that mock data to the user.

**Flight status** — `lib/flights.ts`

```ts
async function getFlightStatus(flight, date) {
  try {
    const res = await fetch(`${API}/flights/${flight}/${date}`);
    if (!res.ok) throw new Error(res.status);
    return map(await res.json());
  } catch {
    return {
      flight,
      scheduledArrival: `${date}T14:30:00Z`,
      actualArrival: `${date}T17:45:00Z`,
      status: "landed",
    };
  }
}
```

Which is wrong in the sense that the application doesn't break. It works, but you don't know that it is erroring out, that there is an issue with the API you are trying to call.

For another example, think you are implementing a conversion rate in your application. Since you are not going to be updating those rates live yourself, you pull them from an API. You have a USD to EUR conversion rate and you ask the AI to implement it. It implements the API call, but then below it, it will most likely implement a placeholder value, since from its general knowledge it knows what the conversion rate generally is, and it will, for example, put 0.92.

**Exchange rate** — `lib/fx.ts`

```ts
const FALLBACK_USD_EUR = 0.92;

async function getUsdToEur() {
  try {
    const res = await fetch(`${FX}/latest?base=USD`);
    return (await res.json()).rates.EUR;
  } catch {
    return FALLBACK_USD_EUR;
  }
}
```

Which might sound okay, but let's say the actual conversion rate is different. This application is live, and the user gets a conversion rate of 0.92 when the actual rate is, for example, 0.86. That is a big difference, and there is no error state flagging it.

Having a proper error state that tells you the API is not working would give the user the experience they are anticipating, instead of giving them false data. It is often way better to know that the app you are using is not working, for any given reason, than to think that it is working and walk away with false information.
