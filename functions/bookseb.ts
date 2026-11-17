// Cloudflare Pages Function: /bookseb (Sebastian's booking link). Handler shared with /bookmagnus.
import { bookingLink } from "./_lib/booking-link";

export const onRequest = bookingLink("https://calendar.app.google/r4v9xQp9S2p3TVFq5");
