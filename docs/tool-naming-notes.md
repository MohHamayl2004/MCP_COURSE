# Tool naming - my notes

Big idea from today: the whole point of a tool name is that the model can figure out when to use it on its own. So the name has to carry its weight. Good tools = clear name, sharp description, one job, honest errors.

Stuff I want to remember:

- One job per tool. Don't build a `manage_everything`. If a tool needs an "action" enum to explain itself, that's a sign it should be a few smaller tools instead.
- Name it verb_noun, snake_case, something you could say out loud. Like `search_notes`, `add_expense`, `get_weather`. If it sounds awkward to say, it's probably a bad name.
- Write the description for the model, not for me. It should say what the tool does, when to reach for it, and what comes back.
- Reads vs. writes matters. `list_`, `get_`, `search_` = safe reads you can call again and again. Anything that changes data (`add_`, `delete_`, `update_`) should make that obvious.

## The rename drill

We had to fix these three: `doThing`, `api`, `helper1`.

The thing I realized: I can't actually rename them properly without knowing what each one does. Which is kind of the lesson — if the name is this vague, nobody (including the model) knows its job. So here's how I'd approach each one.

**doThing** — total grab-bag name. If it really only does one thing, just name that thing (`send_email`, `resize_image`, whatever). If it's secretly doing five things behind an action flag, split it up: `add_expense`, `delete_expense`, `list_expenses`.

**api** — this names *how* it's built, not *what it does*. "api" tells the model nothing about when to call it. Rename to the actual action, like `get_weather` or `fetch_exchange_rate`.

**helper1** — the "1" is the giveaway that someone gave up naming it. Name it after whatever it actually helps with: `format_date`, `validate_email`, `parse_receipt`.

Pattern behind all of them: verb + noun, one job, say it out loud, and make writes look like writes. That's basically the whole thing.
