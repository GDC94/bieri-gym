---
name: components-v2
description: >
  Cooking UI Component Library (v2).
  Trigger: When building new UI components, creating forms, buttons, cards, tables, dialogs, or any UI element. Always use components from src/components/v2 instead of creating new ones or using external libraries directly.
license: MIT
metadata:
  author: germanderbescatoni
  version: "1.0"
  scope: [root, ui]
  auto_invoke: "Building UI / Creating components / Forms / Buttons / Cards / Tables"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Cooking UI Component Library (v2)

## Critical Rule

**ALWAYS use `src/components/v2` for building new UI components.**

```typescript
// ✅ ALWAYS import from v2
import { Button, Body, Card, TextField } from "@/components/v2/ui";

// ❌ NEVER create new base components or use external libraries directly
import { Button } from "some-external-library"; // NO
```

---

## Architecture: Atomic Design

```
src/components/v2/ui/
├── atoms/           # Basic building blocks
│   ├── buttons/     # Button, IconButton, BaseButton, RadioButton
│   ├── typographies/# Heading, Body, Link
│   ├── inputs/      # TextField, Select, Checkbox, Switch, CurrencyField
│   └── display/     # Badge, Chip, Dialog, Tooltip, Spinner, Alert, Toast
├── molecules/       # Compositions of atoms
│   ├── Card/
│   ├── FormControl/
│   ├── Tabs/
│   ├── RadioGroup/
│   ├── CheckboxGroup/
│   ├── DropdownMenu/
│   ├── EmptyState/
│   └── TimeDisplay/
├── organisms/       # Complex components
│   ├── Table/
│   └── Chart/
└── utils/           # Utilities
    ├── icons/       # 100+ project icons
    ├── Popover/
    ├── ScrollWrapper/
    └── ClientOnly/
```

---

## Main Import

```typescript
// Import everything from the unified export
import {
  // Buttons
  Button,
  IconButton,
  BaseButton,

  // Typography
  Heading,
  Body,

  // Inputs
  TextField,
  Select,
  Checkbox,
  Switch,

  // Display
  Badge,
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  Spinner,
  Alert,
  Toast,

  // Molecules
  Card,
  FormControl,
  Tabs,
  RadioGroup,
  DropdownMenu,
  EmptyState,

  // Organisms
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,

  // Icons
  SearchIcon,
  CloseIcon,
  ChevronDownIcon,
  // ... 100+ icons

  // Types
  IconProps,
  ButtonProps,
} from "@/components/v2/ui";
```

---

## Atoms

### Buttons

#### Button
Standard button with text and optional icon.

```typescript
import { Button } from "@/components/v2/ui";
import { SearchIcon } from "@/components/v2/ui";

// Variants: primary | secondary | ghost | cta-primary | cta-success | cta-error | cta-purple
// Sizes: xs | s | m | l

<Button variant="primary" size="m" Icon={SearchIcon}>
  Search
</Button>

<Button variant="ghost" size="s">
  Cancel
</Button>

<Button variant="cta-success" disabled>
  Confirm
</Button>
```

#### IconButton
Button with icon only, no text.

```typescript
import { IconButton } from "@/components/v2/ui";
import { CloseIcon } from "@/components/v2/ui";

<IconButton
  variant="ghost"
  size="xs"
  Icon={CloseIcon}
  onClick={handleClose}
/>
```

#### Button Variants

| Variant | Use Case |
|---------|----------|
| `primary` | Main actions (purple background) |
| `secondary` | Secondary actions (yellow background) |
| `ghost` | Tertiary actions (transparent with border) |
| `cta-primary` | Call-to-action (yellow gradient with glow) |
| `cta-success` | Success actions (green gradient with glow) |
| `cta-error` | Destructive actions (red gradient with glow) |
| `cta-purple` | Brand CTA (purple gradient with glow) |

---

### Typography

#### Heading
For page titles and section headers.

```typescript
import { Heading } from "@/components/v2/ui";

// Variants: h1 | h2 | h3 | h4 | h5 | h6
// Each has predefined font-size, line-height, and letter-spacing

<Heading variant="h1">Page Title</Heading>      // 40px
<Heading variant="h2">Section Title</Heading>   // 34px
<Heading variant="h3">Card Title</Heading>      // 32px
<Heading variant="h4">Subsection</Heading>      // 28px
<Heading variant="h5">Small Header</Heading>    // 24px
<Heading variant="h6">Mini Header</Heading>     // 20px

// Custom tag with heading style
<Heading variant="h2" as="span">Styled as h2 but renders as span</Heading>
```

#### Body
For all body text, labels, and descriptions.

```typescript
import { Body } from "@/components/v2/ui";

// Variants: heading | regular | subtitle
// Sizes: l | m | s | xs | xxs | xxxs

// Regular text
<Body variant="regular" size="m">Regular paragraph text</Body>

// Bold heading style
<Body variant="heading" size="l">Bold large text</Body>

// Subtitle style
<Body variant="subtitle" size="s">Subtitle text</Body>

// As different element
<Body variant="regular" size="xs" as="span">Inline text</Body>
<Body variant="regular" size="xxs" as="label">Form label</Body>

// Alignment
<Body align="center">Centered text</Body>
<Body align="right">Right aligned</Body>
```

#### Body Size Reference

| Size | Font Size | Use Case |
|------|-----------|----------|
| `l` | 17px | Large paragraphs |
| `m` | 16px | Standard text |
| `s` | 15px | Secondary text |
| `xs` | 14px | Small labels |
| `xxs` | 13px | Captions |
| `xxxs` | 12px | Tiny text, badges |

---

### Inputs

#### TextField
Text input with optional icons.

```typescript
import { TextField } from "@/components/v2/ui";
import { SearchIcon, CloseIcon } from "@/components/v2/ui";

<TextField
  value={value}
  onChange={setValue}
  placeholder="Search..."
  PrependIcon={SearchIcon}
/>

<TextField
  value={value}
  onChange={setValue}
  placeholder="Enter amount"
  AppendIcon={CloseIcon}
  error={hasError}
  disabled={isDisabled}
/>

// Textarea mode
<TextField
  value={description}
  onChange={setDescription}
  placeholder="Description..."
  textarea
/>
```

#### Select
Dropdown selection.

```typescript
import { Select } from "@/components/v2/ui";

<Select
  value={selected}
  onValueChange={setSelected}
  options={[
    { value: "sol", label: "Solana" },
    { value: "eth", label: "Ethereum" },
  ]}
  placeholder="Select chain..."
/>
```

#### Checkbox

```typescript
import { Checkbox } from "@/components/v2/ui";

<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
  label="Accept terms"
/>
```

#### Switch

```typescript
import { Switch } from "@/components/v2/ui";

<Switch
  checked={isEnabled}
  onCheckedChange={setIsEnabled}
/>
```

---

### Display

#### Badge

```typescript
import { Badge } from "@/components/v2/ui";

<Badge content="NEW" />
<Badge content="PRO" className="bg-purple-800" />
```

#### Dialog
Modal dialogs using Radix UI.

```typescript
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/v2/ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent title="Confirmation">
    <DialogHeader>
      <Body variant="heading" size="l">Are you sure?</Body>
    </DialogHeader>
    <Body>This action cannot be undone.</Body>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DialogClose>
      <Button variant="cta-error">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Spinner

```typescript
import { Spinner } from "@/components/v2/ui";

<Spinner size="m" />
```

#### Tooltip

```typescript
import { Tooltip } from "@/components/v2/ui";

<Tooltip content="This is helpful info">
  <InfoIcon />
</Tooltip>
```

#### Alert

```typescript
import { Alert } from "@/components/v2/ui";

<Alert variant="success" title="Success!" description="Your changes were saved." />
<Alert variant="error" title="Error" description="Something went wrong." />
<Alert variant="warning" title="Warning" description="Please review your input." />
```

---

## Molecules

### Card
Container with optional header.

```typescript
import { Card } from "@/components/v2/ui";
import { SettingsIcon, InfoIcon } from "@/components/v2/ui";

// Basic card
<Card>
  <Body>Card content here</Body>
</Card>

// Card with header
<Card
  title="Settings"
  Icon={SettingsIcon}
  ButtonIcon={InfoIcon}
  onIconButtonClick={handleInfo}
>
  <Body>Card content</Body>
</Card>

// Card as link
<Card href="/dashboard" title="Dashboard">
  <Body>Click to navigate</Body>
</Card>

// Table variant (less padding)
<Card variant="table" title="Transactions">
  <Table>...</Table>
</Card>
```

### FormControl
Wrapper for form fields with label and error.

```typescript
import { FormControl, TextField } from "@/components/v2/ui";

<FormControl label="Email" error={errors.email?.message}>
  <TextField
    value={email}
    onChange={setEmail}
    error={!!errors.email}
    placeholder="Enter email..."
  />
</FormControl>
```

### Tabs

```typescript
import { Tabs } from "@/components/v2/ui";

<Tabs
  value={activeTab}
  onValueChange={setActiveTab}
  tabs={[
    { value: "overview", label: "Overview" },
    { value: "details", label: "Details" },
    { value: "history", label: "History" },
  ]}
/>
```

### RadioGroup

```typescript
import { RadioGroup } from "@/components/v2/ui";

<RadioGroup
  value={selected}
  onValueChange={setSelected}
  options={[
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
  ]}
/>
```

### DropdownMenu

```typescript
import { DropdownMenu } from "@/components/v2/ui";

<DropdownMenu
  trigger={<IconButton Icon={SettingsIcon} variant="ghost" />}
  items={[
    { label: "Edit", onClick: handleEdit },
    { label: "Delete", onClick: handleDelete, destructive: true },
  ]}
/>
```

### EmptyState

```typescript
import { EmptyState } from "@/components/v2/ui";

<EmptyState
  title="No transactions"
  description="Your transactions will appear here"
  Icon={TransactionsIcon}
/>
```

---

## Organisms

### Table

```typescript
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  TableCellSkeleton,
} from "@/components/v2/ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Token</TableHead>
      <TableHead>Balance</TableHead>
      <TableHead>Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {isLoading ? (
      <TableRow>
        <TableCell><TableCellSkeleton /></TableCell>
        <TableCell><TableCellSkeleton /></TableCell>
        <TableCell><TableCellSkeleton /></TableCell>
      </TableRow>
    ) : tokens.length === 0 ? (
      <TableEmptyState renderTable columnsCount={3} />
    ) : (
      tokens.map((token) => (
        <TableRow key={token.id}>
          <TableCell>{token.symbol}</TableCell>
          <TableCell>{token.balance}</TableCell>
          <TableCell>{token.value}</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
```

---

## Icons

100+ project-specific icons available.

```typescript
import {
  SearchIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  EditIcon,
  DeleteIcon,
  CopyIcon,
  SettingsIcon,
  FilterIcon,
  SortIcon,
  InfoIcon,
  EyeIcon,
  HideIcon,
  // ... and many more
} from "@/components/v2/ui";

// Icon Props
interface IconProps {
  size?: "l" | "m" | "s" | "xs" | "xxs";  // l=32, m=24, s=18, xs=14, xxs=12
  fill?: string;
  className?: string;
}

// Usage
<SearchIcon size="m" fill="currentColor" />
<CloseIcon size="s" className="fill-icon-secondary" />
```

---

## Patterns

### Creating a New Feature Component

```typescript
// features/MyFeature/components/MyFeatureCard.tsx
import { Card, Body, Button, Badge } from "@/components/v2/ui";
import { InfoIcon } from "@/components/v2/ui";

interface MyFeatureCardProps {
  title: string;
  description: string;
  isNew?: boolean;
  onAction: () => void;
}

export const MyFeatureCard = ({
  title,
  description,
  isNew,
  onAction,
}: MyFeatureCardProps) => {
  return (
    <Card title={title} Icon={InfoIcon}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Body variant="heading" size="m">{title}</Body>
          {isNew && <Badge content="NEW" />}
        </div>
        <Body variant="regular" size="s" className="text-text-secondary">
          {description}
        </Body>
        <Button variant="primary" size="s" onClick={onAction}>
          View Details
        </Button>
      </div>
    </Card>
  );
};
```

### Form with Validation

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormControl, TextField, Button, Select } from "@/components/v2/ui";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  chain: z.enum(["solana", "ethereum"]),
});

type FormData = z.infer<typeof schema>;

export const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormControl label="Name" error={errors.name?.message}>
        <TextField
          {...register("name")}
          placeholder="Enter name..."
          error={!!errors.name}
        />
      </FormControl>

      <FormControl label="Email" error={errors.email?.message}>
        <TextField
          {...register("email")}
          type="email"
          placeholder="Enter email..."
          error={!!errors.email}
        />
      </FormControl>

      <FormControl label="Chain" error={errors.chain?.message}>
        <Select
          value={watch("chain")}
          onValueChange={(val) => setValue("chain", val)}
          options={[
            { value: "solana", label: "Solana" },
            { value: "ethereum", label: "Ethereum" },
          ]}
        />
      </FormControl>

      <Button type="submit" variant="cta-primary">
        Submit
      </Button>
    </form>
  );
};
```

---

## Quick Reference

### Do's
- Import from `@/components/v2/ui`
- Use `Body` for all text (not raw `<p>` or `<span>`)
- Use `Heading` for titles (not raw `<h1>` - `<h6>`)
- Use `Button` variants instead of custom button styles
- Use `Card` for content containers
- Use `FormControl` to wrap form inputs
- Use project icons from `@/components/v2/ui`

### Don'ts
- Don't create new base components (buttons, inputs, etc.)
- Don't import directly from Radix UI (use wrapped components)
- Don't use raw HTML elements for styled text
- Don't hardcode colors (use Tailwind design tokens)
- Don't create duplicate icon components

### File Structure for New Components

```
features/
└── MyFeature/
    ├── components/
    │   ├── MyFeatureCard.tsx      # Uses v2 atoms/molecules
    │   ├── MyFeatureForm.tsx      # Uses v2 inputs + FormControl
    │   └── index.ts
    ├── hooks/
    │   └── useMyFeature.ts
    ├── types.ts
    └── index.ts
```

## References of Use

Real examples from the codebase that correctly implement the v2 component library.

### Dialog + Form + FormControl + TextField + Button
Complete modal with form validation using React Hook Form + Zod.

```
src/app/(cook)/wallet-manager/components/commons/ChangeWalletNameModal.tsx
```

**What it demonstrates:**
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogClose`
- `FormControl` with error handling
- `TextField` with controlled input
- `Button` with loading state
- `Divider` for visual separation
- Zod schema validation

---

### Card + Body + Divider
Card with metrics and proper typography.

```
src/app/(cook)/trading-station/TradingStationContent/TradingPanel/TokenPositionSummary/TokenPositionSummary.tsx
```

**What it demonstrates:**
- `Card` with custom `bodyClassName`
- `Body` with variants and conditional styling
- `Divider` with vertical variant
- Skeleton loading pattern

---

### Body Typography Patterns
Proper use of Body component for metric rows.

```
src/app/(cook)/wallet-manager/components/views/Spot/widgets/TradePerformance/components/TradeMetricRow.tsx
```

**What it demonstrates:**
- `Body` as `span` element
- Multiple `Body` variants in same component
- Semantic color classes (`text-text-secondary`, `text-green-300`, `text-red-300`)

---

### StatusTableItem + Tooltip
Status badges with conditional tooltips.

```
src/app/(cook)/trading-station/TradingStationContent/MarketPanel/TradingDataTabsSection/components/OrderStatusBadge.tsx
```

**What it demonstrates:**
- `StatusTableItem` with dynamic variants
- `Tooltip` for additional context
- Accessibility with `role="status"`

---

### Dialog Header Pattern
Reusable modal header component.

```
src/app/(cook)/wallet-manager/components/TotalBalance/components/operationsModals/components/ModalHeader.tsx
```

**What it demonstrates:**
- `DialogHeader`, `DialogTitle`, `DialogClose` composition
- Icon integration with Dialog

---

### Table with Custom Cells
Data table with custom cell renderers.

```
src/app/(cook)/orders/components/AdvancedOrderStrategyPanel/tables/TwapOrderHistoryTable.tsx
```

**What it demonstrates:**
- `TextTableItem` for text cells
- `AvatarTableItem` for token cells
- TanStack Table integration
- Column definitions with v2 components

---

### Widget Title Pattern
Reusable title with icon.

```
src/app/(cook)/wallet-manager/components/commons/WidgetTitle.tsx
```

**What it demonstrates:**
- `Body` for styled text
- Dynamic icon component
- Composition pattern

---

### Quick Lookup Table

| Use Case | Reference File |
|----------|----------------|
| Modal + Form | `ChangeWalletNameModal.tsx` |
| Card with metrics | `TokenPositionSummary.tsx` |
| Typography patterns | `TradeMetricRow.tsx` |
| Status badges | `OrderStatusBadge.tsx` |
| Table cells | `TwapOrderHistoryTable.tsx` |
| Modal header | `ModalHeader.tsx` |
| Widget title | `WidgetTitle.tsx` |



## Resources

- [Shadcn UI Docs](https://github.com/shadcn-ui/ui)
