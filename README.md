# plugandpay-sdk

TypeScript SDK for the [Plug&Pay](https://www.plugandpay.nl) REST API.

- Zero runtime dependencies (native `fetch`)
- Dual ESM + CJS build
- Full TypeScript types for all resources, filters, and includes
- Automatic `camelCase` ↔ `snake_case` conversion
- Typed error classes for every HTTP status

## Installation

```bash
npm install plugandpay-sdk
```

> Requires Node.js 18+

## Quick Start

```typescript
import { PlugAndPay, PaymentStatus, OrderIncludes } from 'plugandpay-sdk';

const client = new PlugAndPay({ apiToken: 'your-api-token' });

// List orders with filters and includes
const { data: orders, meta } = await client.orders.list({
  filters: { paymentStatus: PaymentStatus.Paid, limit: 25 },
  include: [OrderIncludes.Billing, OrderIncludes.Items],
});

// Get a single order
const order = await client.orders.get(123, {
  include: [OrderIncludes.Payment],
});

// Create an order
const newOrder = await client.orders.create({
  invoiceStatus: 'concept',
  billing: {
    contact: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  },
});

// Update an order
const updated = await client.orders.update(123, { tags: ['vip'] });

// Delete an order
await client.orders.delete(123);
```

## Configuration

```typescript
const client = new PlugAndPay({
  apiToken: 'your-api-token',    // Required
  baseUrl: 'https://api.plugandpay.com', // Optional, defaults to this
  timeout: 30000,                // Optional, request timeout in ms
});
```

## Resources

### Orders

```typescript
client.orders.list(options?)
client.orders.get(id, options?)
client.orders.create(data, options?)
client.orders.update(id, data, options?)
client.orders.delete(id)
```

**Includes:** `billing`, `items`, `payment`, `discounts`, `taxes`, `comments`, `tags`

**Filters:** `affiliateId`, `checkoutId`, `contractId`, `email`, `query`, `paymentStatus`, `invoiceStatus`, `sinceInvoiceDate`, `untilInvoiceDate`, `sincePaidAt`, `untilPaidAt`, `limit`, `page`, `direction`, `sort`, `mode`, `source`

### Order Payments

```typescript
client.orders.payment(orderId).get()
client.orders.payment(orderId).update(data)
```

### Products

```typescript
client.products.list(options?)
client.products.get(id, options?)
client.products.create(data, options?)
client.products.update(id, data, options?)
client.products.delete(id)
```

**Includes:** `pricing`, `tax_rates`

**Filters:** `direction`, `hasLimitedStock`, `isDeleted`, `limit`, `page`, `query`, `sort`, `tag`, `type`

### Subscriptions

```typescript
client.subscriptions.list(options?)
client.subscriptions.get(id, options?)
client.subscriptions.create(data, options?)
client.subscriptions.update(id, data, options?)
client.subscriptions.delete(id)
```

**Includes:** `billing`, `pricing`, `product`, `tags`, `trial`, `meta`

**Filters:** `affiliateId`, `billingScheduleInterval`, `country`, `direction`, `hasOrders`, `isTrial`, `limit`, `mode`, `page`, `productId`, `query`, `sinceCreatedAt`, `status`, `sort`, `tag`, `type`, `untilCreatedAt`

### Checkouts

```typescript
client.checkouts.list(options?)
client.checkouts.get(id)
client.checkouts.create(data)
client.checkouts.update(id, data)
client.checkouts.delete(id)
```

### Rules

```typescript
client.rules.list(options?)
client.rules.get(id)
client.rules.create(data)
client.rules.update(id, data)
client.rules.delete(id)
client.rules.deleteMany(ids)
```

### Tax Rates

```typescript
client.taxRates.list(options?)
```

### Affiliate Sellers

```typescript
client.affiliateSellers.list(options?)
client.affiliateSellers.get(id, options?)
```

**Includes:** `address`, `contact`, `profile`, `statistics`, `payout_options`, `payout_methods`

### Memberships Settings

```typescript
client.membershipsSettings.list()
client.membershipsSettings.get(id)
client.membershipsSettings.create(data)
client.membershipsSettings.update(id, data)
client.membershipsSettings.delete(id)
```

## Error Handling

All API errors throw typed exceptions that extend `PlugAndPayError`:

```typescript
import {
  PlugAndPayError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  TimeoutError,
} from 'plugandpay-sdk';

try {
  await client.orders.get(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Order not found');
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.errors);
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid API token');
  } else if (error instanceof RateLimitError) {
    console.log('Too many requests, retry later');
  }
}
```

| Error Class           | HTTP Status |
|-----------------------|-------------|
| `AuthenticationError` | 401         |
| `ForbiddenError`      | 403         |
| `NotFoundError`       | 404         |
| `ValidationError`     | 422         |
| `RateLimitError`      | 429         |
| `ServerError`         | 500+        |
| `TimeoutError`        | —           |

## Enums

The SDK exports typed enums for all known API values:

```typescript
import {
  PaymentStatus,
  PaymentMethod,
  InvoiceStatus,
  SubscriptionStatus,
  Mode,
  Direction,
  Interval,
  ContractType,
  CountryCode,
  Source,
} from 'plugandpay-sdk';
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run typecheck

# Build
npm run build
```

## License

MIT
