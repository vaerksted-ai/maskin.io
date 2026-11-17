// Cloudflare Pages Function: /bookmagnus (Magnus's booking link). Handler shared with /bookseb.
import { bookingLink } from "./_lib/booking-link";

export const onRequest = bookingLink("https://calendar.app.google/8qxVPjdbYhAyFZzEA");
