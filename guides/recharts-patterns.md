# Recharts Patterns

## Chart Components Used in This Project

| Task | Component |
|------|-----------|
| Line over time | `<LineChart>` |
| Break-even reference | `<ReferenceLine y={0} strokeDasharray="3 3" />` |
| Tooltips | `<Tooltip formatter={(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />` |
| Responsive wrapper | `<ResponsiveContainer width="100%" height={300}>` |

## Minimal Working Chart

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <ReferenceLine y={0} strokeDasharray="3 3" stroke="#999" />
    <Line type="monotone" dataKey="cashFlow" stroke="#2563eb" dot={false} />
  </LineChart>
</ResponsiveContainer>
```

## Data Shape Expected

```js
// data passed to <LineChart data={...}>
[
  { month: 1, cashFlow: -5000 },
  { month: 2, cashFlow: -3500 },
  // ...
]
```

## Rules

- Always wrap in `<ResponsiveContainer>` — never set a fixed pixel width
- Use `dot={false}` on `<Line>` for smooth cash-flow curves
- Format all Y-axis currency values in the `<Tooltip>` formatter, not in the data array
- Never add a second chart library — Recharts handles all chart needs for this project
