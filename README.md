# Caterpillar 🐛 📦 🦋

A simple **[feature toggle][feature-toggles]** library for React ⚛️.

## Install

```bash
yarn add react-caterpillar

# or

npm install react-caterpillar
```

## Usage

```typescript
// feature-toggles.ts

import { initCaterpillar } from "caterpillar";
import type { FeatureGroup } from "caterpillar";

export enum FeatureName {
  blueButton = "blueButton",
  displayVersion = "displayVersion",
}

const FEATURES: FeatureGroup<FeatureName> = {
  [FeatureName.blueButton]: {
    name: FeatureName.blueButton,
    description: "Blue button",
    active: true,
  },
  [FeatureName.displayVersion]: {
    name: FeatureName.displayVersion,
    description: "Display app version on Home screen",
    active: false,
  },
};

const Caterpillar = initCaterpillar(FEATURES);

export default Caterpillar
```

```typescript
// app.tsx

import React from "react";
import Caterpillar, { FeatureName } from "./feature-toggles"

function HomeScreen() {
  const displayVersion = Caterpillar.useFeature(FeatureName.displayVersion);

  return (
    <div>
      <main>
        <div>Hi there!</div>
      </main>
      <footer>{displayVersion.active ? <p>Version 1.0.0</p> : null}</footer>
    </div>
  );
}

function App() {
  return (
    <Caterpillar.Provider>
      <HomeScreen />
    </Caterpillar.Provider>
  );
}
```

## Documentation

This section explains the rest of the API.

### Using the `Feature` component

You can access feature toggles using either the React Hooks API or the higher order `Caterpillar.Feature` component.

```typescript
import Caterpillar, { FeatureName } from "./feature-toggles";

function AboutScreen() {
  const [count, setCount] = React.useState(0);

  return (
    <main>
      <Caterpillar.Feature name={FeatureName.blueButton} fallback={null}>
        <button
          style={{ backgroundColor: "blue" }}
          onClick={() => setCount((count) => count + 1)}
        >
          Count is: {count}
        </button>
      </Caterpillar.Feature>
    </main>
  );
}
```

### Accessing and updating all features

You can use the React Hook `Caterpillar.useFeatures` to access all available features. This is especially useful for implementing a hidden feature toggle screen where users can toggle features locally.

```typescript
import Caterpillar from "./feature-toggles";

function HiddenScreen() {
  const [features, setFeature] = Caterpillar.useFeatures();

  return (
    <div>
      <h2>All features</h2>

      <ul>
        {features.map((feature) => (
          <li key={feature.name}>
            <label>
              <input
                type="checkbox"
                name={feature.name}
                checked={feature.active}
                onChange={(event) =>
                  setFeature(feature.name, event.target.checked)
                }
              />
              {feature.description}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

[feature-toggles]: https://martinfowler.com/articles/feature-toggles.html
