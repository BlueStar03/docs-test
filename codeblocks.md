---
layout: default
title: "Code Blocks"
description: "readme"
author: "Test Suite"
date: 2026-05-21
tags: [test, markdown, sample]
draft: false
---
# CodeBlocks


```


#!/bin/sh

project="docs-test"
echo "Building $project..."

bundle exec jekyll build
```
{: file='build.sh' window='linux' numbers='true' zebra='true' highlight='6' }

```yml
theme:
  code_blocks:
    title_bar: true
    copy_button: true
    language_icons: true
```

```basic
10 PRINT "LORE ARCHIVE"
20 INPUT "ENTER YOUR NAME: "; N$
30 PRINT "WELCOME, "; N$
40 FOR I = 1 TO 3
50 PRINT "LOADING"; I
60 NEXT I
70 PRINT "READY."
```

```clojure
(defn total-score [scores]
  (reduce + scores))

(def party-scores [12 18 25 30])

(println "Total:" (total-score party-scores))
```
{: file='score.clj' window='linux' numbers='true' zebra='true' highlight='2' }

---



```javascript
const x = 1;
const y = 2;
const z = 3;
const w = 4;
```
{: highlight='2,4' file='example.js' window='linux'}

```javascript
const animals = ["fox", "owl", "otter", "lynx"];
const pick = animals[Math.floor(Math.random() * animals.length)];

console.log(`Random animal: ${pick}`);
```


```javascript
const animals = ["fox", "owl", "otter", "lynx"];
const pick = animals[Math.floor(Math.random() * animals.length)];

console.log(`Random animal: ${pick}`);
```
{: file='example.js' zebra='true' numbers='false' }


```python
def random_pick(items):
    import random
    return random.choice(items)

print(random_pick(["fox", "owl", "otter"]))
```
{: file='example.py' window='linux' numbers='true' zebra='true' highlight='3' }

---

```javascript
function rollDie(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

console.log(`You rolled a ${rollDie(20)}.`);
```
{: file='dice.js' window='linux' numbers='true' zebra='true' highlight='2' }

```ruby
def title_case(text)
  text.split.map(&:capitalize).join(" ")
end

puts title_case("the quiet forest path")
```
{: file='title_case.rb' window='macos' numbers='true' zebra='true' highlight='2' }

```css
.card {
  padding: 1rem;
  border-radius: 0.75rem;
  background: color-mix(in srgb, white 92%, cornflowerblue);
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 12%);
}
```
{: file='card.css' window='windows' numbers='true' zebra='true' highlight='4' }

```sql
SELECT name, score
FROM players
WHERE score >= 1000
ORDER BY score DESC
LIMIT 5;
```
{: file='leaderboard.sql' window='linux' numbers='true' zebra='true' highlight='3' }

```gml
var move_x = keyboard_check(ord("D")) - keyboard_check(ord("A"));
var move_y = keyboard_check(ord("S")) - keyboard_check(ord("W"));

x += move_x * 4;
y += move_y * 4;
```
{: file='obj_player_step.gml' window='windows' numbers='false' zebra='true' highlight='4-5' }

---

```typescript
type Item = {
  name: string;
  count: number;
};

const inventory: Item[] = [
  { name: "lantern", count: 2 },
  { name: "rope", count: 1 },
  { name: "ration", count: 5 }
];

console.log(inventory.filter(item => item.count > 1));
```
{: file='inventory.ts' window='windows' numbers='true' zebra='true' highlight='8' }

```rust
fn double_values(values: &[i32]) -> Vec<i32> {
    values.iter().map(|value| value * 2).collect()
}

fn main() {
    let numbers = vec![2, 4, 6];
    println!("{:?}", double_values(&numbers));
}
```
{: file='double.rs' window='linux' numbers='true' zebra='true' highlight='2' }

```html
<article class="note">
  <h2>Field Report</h2>
  <p>The western path is clear, but the bridge is unstable.</p>
  <button type="button">Mark Reviewed</button>
</article>
```
{: file='report.html' window='macos' numbers='true' zebra='true' highlight='3' }

```yaml
site:
  title: "Lore Archive"
  theme: "remote-docs"

features:
  search: true
  dark_mode: true
  code_titles: true
```
{: file='config.yml' window='linux' numbers='true' zebra='true' highlight='6-8' }


---

```go
package main

import "fmt"

func main() {
	names := []string{"fox", "owl", "otter"}
	for _, name := range names {
		fmt.Println(name)
	}
}
```
{: file='animals.go' window='linux' numbers='true' zebra='true' highlight='7' }

```java
public class Greeting {
    public static void main(String[] args) {
        String name = "Lira";
        System.out.println("Hello, " + name + ".");
    }
}
```
{: file='Greeting.java' window='windows' numbers='true' zebra='true' highlight='4' }

```c
#include <stdio.h>

int main(void) {
    int health = 75;
    printf("Health: %d\n", health);
    return 0;
}
```
{: file='status.c' window='linux' numbers='true' zebra='true' highlight='5' }

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {10, 20, 30};

    for (int score : scores) {
        std::cout << score << "\n";
    }
}
```
{: file='scores.cpp' window='windows' numbers='true' zebra='true' highlight='7-9' }

```csharp
using System;

class Program {
    static void Main() {
        string item = "lantern";
        Console.WriteLine($"Found: {item}");
    }
}
```
{: file='Program.cs' window='windows' numbers='true' zebra='true' highlight='6' }

```php
<?php

$items = ["bread", "cheese", "apple"];

foreach ($items as $item) {
    echo strtoupper($item) . PHP_EOL;
}
```
{: file='inventory.php' window='linux' numbers='true' zebra='true' highlight='5-7' }

```swift
let names = ["Kara", "Lira", "Niro"]

for name in names {
    print("Name: \(name)")
}
```
{: file='Names.swift' window='macos' numbers='true' zebra='true' highlight='3-5' }

```kotlin
fun main() {
    val scores = listOf(12, 18, 24)
    val total = scores.sum()

    println("Total score: $total")
}
```
{: file='Main.kt' window='linux' numbers='true' zebra='true' highlight='3' }

```scss
$accent: #8b5cf6;

.badge {
  color: white;
  background: $accent;

  &:hover {
    filter: brightness(1.1);
  }
}
```
{: file='badge.scss' window='macos' numbers='true' zebra='true' highlight='7-9' }

```sass
$accent: #cf649a

.panel
  padding: 1rem
  border-radius: 0.75rem
  background: $accent
```
{: file='panel.sass' window='linux' numbers='true' zebra='true' highlight='4-6' }

```json
{
  "title": "Lore Archive",
  "version": "0.1.0",
  "features": {
    "search": true,
    "darkMode": true
  }
}
```
{: file='settings.json' window='windows' numbers='true' zebra='true' highlight='4-7' }

```toml
title = "Lore Archive"
version = "0.1.0"

[features]
search = true
dark_mode = true
code_titles = true
```
{: file='config.toml' window='linux' numbers='true' zebra='true' highlight='4-7' }

```bash
#!/usr/bin/env bash

name="archive"
mkdir -p "$name"
echo "# New Notes" > "$name/index.md"
```
{: file='setup.sh' window='linux' numbers='true' zebra='true' highlight='4-5' }

```markdown
# Field Notes

The western bridge is unstable.

> Repair crew should inspect it before winter.

- status: pending
- priority: high
```
{: file='notes.md' window='macos' numbers='true' zebra='true' highlight='5' }

```gdscript
extends Node2D

var speed := 120.0

func _process(delta):
	var direction := Input.get_vector("left", "right", "up", "down")
	position += direction * speed * delta
```
{: file='player.gd' window='linux' numbers='true' zebra='true' highlight='6-7' }

