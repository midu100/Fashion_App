import React from 'react'
import CountUpLib from 'react-countup'

// react-countup is a CJS module — the default export can resolve to the module
// object in some production builds. Resolve the actual component defensively.
const CountUp = CountUpLib?.default || CountUpLib

// ====== Split "$250,450.00" / "48.1%" / "340 products" / "2019" into
// prefix + number + suffix. Keeps the original comma style (so years like 2019
// stay 2019, not 2,019). Returns null for non-numeric text.
const parseValue = (val) => {
  const str = String(val ?? '')
  const match = str.match(/-?[\d,]*\.?\d+/)
  if (!match) return null
  const numStr = match[0]
  const clean = numStr.replace(/,/g, '')
  return {
    num: parseFloat(clean),
    prefix: str.slice(0, match.index),
    suffix: str.slice(match.index + numStr.length),
    decimals: clean.includes('.') ? clean.split('.')[1].length : 0,
    separator: numStr.includes(',') ? ',' : '',
  }
}

// ====== Animated number — counts up when scrolled into view ======
const AnimatedNumber = ({ value, duration = 1.6, className }) => {
  const p = parseValue(value)
  if (!p) return <span className={className}>{value}</span>
  return (
    <span className={className}>
      <CountUp
        end={p.num}
        duration={duration}
        separator={p.separator}
        decimals={p.decimals}
        prefix={p.prefix}
        suffix={p.suffix}
        enableScrollSpy
        scrollSpyOnce
      />
    </span>
  )
}

export default AnimatedNumber
