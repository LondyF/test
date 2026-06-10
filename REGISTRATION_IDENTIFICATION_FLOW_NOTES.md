# Registration Identification Flow Notes

This file documents the temporary registration-flow prototype work so it can be recreated after resetting the branch.

## Goal

Prototype visuals for registration changes requested by the PO:

- Ask Fatum users whether they have a migrant policy.
- Add a separate next-step screen asking how the user wants to identify.
- Show identification choices for PO discussion/screenshots without fully implementing backend routing yet.

## Important Product Decisions Captured

- The migrant-policy question is only shown for Fatum-like insurers.
- Fatum-like detection should include:
  - static id `Insurers.Fatum`
  - dynamic insurer names containing `fatum`, such as `GG-Fatum`
- The migrant-policy answer defaults to `Nee`.
- The temporary identification-method screen should appear after pressing `Volgende` on the insurance screen.
- The identification-method screen is visual/prototype only for now.
- The options shown are:
  - `Sedula`
  - `Kaartcontrole`
  - `Paspoort of ID`
- `Kaartcontrole` is disabled in the mock.
- `Sedula` and `Paspoort of ID` are tappable cards with local visual selected state.
- Do not show `Aanbevolen`.
- The screen should use literal Dutch copy for prototype screenshots, not translation keys.

## Files Changed

### `src/features/Auth/screens/steps/enterInsuranceInformation.step.tsx`

Changes made:

- Added migrant-policy state:

```tsx
const [hasImmigrantePolis, setHasImmigrantePolis] = useState(false);
```

- Added selected insurer lookup and Fatum-like detection:

```tsx
const selectedInsurer = insurers.find(x => x.id === selectedInsurerId);
const shouldShowImmigrantePolis =
  selectedInsurerId === Insurers.Fatum ||
  selectedInsurer?.naam.toLowerCase().includes('fatum');
```

- Added async default selected insurer fix because insurer LOV data loads after initial render:

```tsx
useEffect(() => {
  if (selectedInsurerId || !insurers[0]?.id) {
    return;
  }

  setSelectedInsurerId(insurers[0].id);
}, [insurers, selectedInsurerId]);
```

- Made the insurer picker controlled:

```tsx
value={selectedInsurerId}
```

- Reset migrant-policy selection when changing away from Fatum-like insurers:

```tsx
const insurer = insurers.find(x => x.id === value);
const isFatum =
  value === Insurers.Fatum ||
  insurer?.naam.toLowerCase().includes('fatum');

if (!isFatum) {
  setHasImmigrantePolis(false);
}
```

- Replaced direct registration submission in `handleSubmit` with navigation to the visual identification step:

```tsx
dispatch({
  type: ActionKind.SET_IDENTIFICATION_PREVIEW_HIGHLIGHT,
  payload: shouldShowImmigrantePolis ? hasImmigrantePolis : false,
});
setStep(Steps.IdentificationMethodPreview);
```

- Added the migrant-policy card:

```tsx
{shouldShowImmigrantePolis ? (
  <View style={styles.immigrantePolisCard}>
    <Typography
      textStyle={styles.immigrantePolisTitle}
      align="left"
      variant="b1"
      color="white"
      fontWeight="bold"
      text="Voor migranten"
    />
    <Typography
      textStyle={styles.immigrantePolisDescription}
      align="left"
      variant="b1"
      color="white"
      text="Heeft u een migrantenpolis?"
    />
    {/* Nee / Ja segmented buttons */}
  </View>
) : null}
```

### `src/features/Auth/screens/steps/identificationMethodPreview.step.tsx`

New temporary screen/component.

Purpose:

- Separate visual-only step after insurance.
- Useful for screenshots and PO discussion.
- Does not perform final backend routing.

Key behavior:

- Receives `highlightOnfido`.
- Initializes selected method to `onfido` when `highlightOnfido` is true, otherwise `sedula`.
- `Sedula` and `Paspoort of ID` are tappable via `TouchableOpacity`.
- `Kaartcontrole` is disabled.
- `Terug` navigates back to insurance.
- `Volgende` has a harmless no-op handler for now.

Suggested component shape:

```tsx
interface IdentificationMethodPreviewStepProps {
  highlightOnfido?: boolean;
  dispatch: React.Dispatch<Action>;
}
```

Important local state:

```tsx
const [selectedMethod, setSelectedMethod] = useState(
  highlightOnfido ? 'onfido' : 'sedula',
);
```

### `src/features/Auth/screens/steps/index.ts`

Export the preview step:

```tsx
import IdentificationMethodPreviewStep from './identificationMethodPreview.step';

export {
  // ...
  IdentificationMethodPreviewStep,
};
```

### `src/features/Auth/screens/register.screen.tsx`

Changes made:

- Import `IdentificationMethodPreviewStep`.
- Add a temporary step:

```tsx
IdentificationMethodPreview,
```

- Add temporary reducer action:

```tsx
SET_IDENTIFICATION_PREVIEW_HIGHLIGHT = 'SET_IDENTIFICATION_PREVIEW_HIGHLIGHT',
```

- Add temporary state:

```tsx
highlightOnfidoIdentification: boolean;
```

- Add initial state:

```tsx
highlightOnfidoIdentification: false,
```

- Add reducer case:

```tsx
case ActionKind.SET_IDENTIFICATION_PREVIEW_HIGHLIGHT: {
  return {
    ...state,
    highlightOnfidoIdentification: action.payload as boolean,
  };
}
```

- Add tracker step:

```tsx
{step: Steps.IdentificationMethodPreview, title: 'Identificatie'},
```

- Add render switch case:

```tsx
case Steps.IdentificationMethodPreview:
  return (
    <IdentificationMethodPreviewStep
      dispatch={dispatch}
      highlightOnfido={state.highlightOnfidoIdentification}
    />
  );
```

## Prior Backend Payload Prototype

Earlier in the work, `immigrantePolis` was threaded into registration payload:

- `src/hooks/useRegisterUser.ts`
- `src/features/Auth/services/auth-service.ts`

If recreating the full functional version later, add:

```ts
immigrantePolis?: boolean;
```

to the registration mutation values and pass it into `registerUser`.

Then add the request body field:

```ts
immigrantePolis,
```

to `/auth-rn1/saveAppUser`.

For the current screenshot-only prototype, this is not required if the insurance screen only navigates to the preview step.

## Verification Used

Focused lint command used repeatedly:

```sh
./node_modules/.bin/eslint \
  "src/features/Auth/screens/register.screen.tsx" \
  "src/features/Auth/screens/steps/enterInsuranceInformation.step.tsx" \
  "src/features/Auth/screens/steps/identificationMethodPreview.step.tsx" \
  "src/features/Auth/screens/steps/index.ts"
```

Full `yarn lint` was not useful as a clean signal because the repo already has unrelated lint/prettier failures in other files.

## Notes For Recreating Later

1. First add the migrant-policy UI to `enterInsuranceInformation.step.tsx`.
2. Add the separate `identificationMethodPreview.step.tsx`.
3. Add `IdentificationMethodPreview` to the `Steps` enum and render switch in `register.screen.tsx`.
4. Change insurance `Volgende` to navigate to the preview step.
5. Keep all copy literal until final translations are ready.
6. Once the PO approves the direction, replace the preview step with real routing and backend behavior.
