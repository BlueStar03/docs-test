---
layout: default
title: "Readme"
description: "readme"
author: "Test Suite"
date: 2026-05-21
tags: [test, markdown, sample]
draft: false
---

# Admonitions

Styled callout boxes for highlighting important information. Two syntaxes, one config.

## Configuration

Edit `_data/admonitions.yml` to define admonition types:

```yaml
note:
  icon: '<svg>...</svg>'    # emoji or SVG markup
  color: "#0969da"          # hex, rgb, hsl, named color
  title: "Note"             # optional override (defaults to capitalized type)

custom:
  icon: "💡"
  color: "#1a7f37"
```

The default config includes: `note`, `tip`, `important`, `warning`, `caution`, `danger`, `success`, `question`. Add, override, or remove as needed.

## Syntax 1: GitHub Alerts

Full-width callout with title bar and icon.

```markdown
> [!WARNING]
> Default title (capitalized from type).

> [!WARNING] Custom Title
> Overrides the default title.

> [!WARNING] Use `npm install` first
> Inline formatting (code, bold, italic) is preserved in the title.

> [!WARNING] ""
> No title row at all — just content with the colored border and background.
```

**Collapsible variant:**

```markdown
> [!WARNING]+ Open by default
> Click the title to collapse.

> [!WARNING]- Closed by default
> Click to expand.
```

## Syntax 2: Prompts

Inline icon at the start of the first line. Uses kramdown's IAL (inline attribute list).

```markdown
> This is a subtle callout with the icon inline.
{: .prompt-warning }

> A prompt with a custom color.
{: .prompt-custom }
```

## Nested Blockquotes

Plain nested blockquotes inherit the parent's color:

```markdown
> [!WARNING]
> Main warning content
>
>> Nested quote — also styled as warning
```

Use `[!TYPE]` on nested blockquotes for a different color:

```markdown
> [!WARNING]
> Main content
>
>> [!TIP]
>> Nested tip — purple instead of yellow
```

## Examples


> [!IMPORTANT] Run `build.sh` before deploy
> The script handles all setup automatically.

> [!NOTE]- ""
> Hidden by default. Click the chevron to expand.

> [!TIP]
> Quick tip for users.

> [!WARNING]
> Critical warning.

> This is a prompt
{: .prompt-custom }

---

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

> [!SUCCESS]
> Confirms that an action was completed successfully or that the desired outcome was achieved.

> [!QUESTION]
> Highlights a question, prompt, or point that needs clarification or further consideration.