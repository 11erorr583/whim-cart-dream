# Playful Shopper

this is the description of project I want to build "Build ONLY the frontend of my fictional shopping entertainment application.

IMPORTANT:

Do not create a backend.

Do not create APIs.

Do not create a database.

Do not create authentication.

Do not create user accounts.

Do not create payment processing.

Do not create real checkout.

Do not create phone/SMS functionality.

Do not create marketplace functionality.

Do not implement AI scam detection yet.

Use:

- React

- TypeScript

- Modern CSS

- Component-based architecture

The frontend should be designed so that a FastAPI backend can be connected later through REST APIs.

Core screens:

1. Landing page

2. Shopping personality selection

3. Product catalog

4. Product details

5. Fictional shopping cart

6. Fictional checkout

7. Fictional order confirmation

8. Imaginary delivery countdown

9. Simulated in-browser delivery call

10. Final shopping result

11. Replay / reset experience

Shopping personalities:

- Impulse Buyer

- Window Shopper

- Delusional Millionaire

- Responsible Adult

The experience must clearly communicate that it is fictional.

Every checkout-related screen should visibly state:

"This is a fictional shopping experience.

No purchase is made and no money is charged."

Do NOT include:

- payment fields

- credit/debit card fields

- phone number fields

- home address fields

- government ID fields

- real delivery information

Use mock product data only.

For the first version, product data can be stored in a local TypeScript mock-data file.

Use localStorage only for temporary gameplay state such as:

- selected personality

- fictional cart

- fictional order

- delivery state

- final result

Do not store sensitive personal information.

Architecture requirements:

Create reusable components.

Keep business logic separate from UI where practical.

Use TypeScript interfaces/types for products, cart items, personality, fictional orders, and session state.

Avoid hardcoding the same values across multiple components.

Keep the code clean and understandable for a developer who will later connect a FastAPI backend.

Create a clear folder structure.

The application should be responsive on:

- desktop

- tablet

- mobile

Include accessible buttons, labels, keyboard navigation, and reduced-motion considerations.

For now, focus entirely on creating a polished frontend experience."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://whim-cart-dream.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2b932ddd-8347-4faf-91a0-eb367151d086).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
