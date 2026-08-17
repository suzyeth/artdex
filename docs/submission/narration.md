# Demo video — word-for-word narration (deep cut)

Read aloud while screen-recording. ~2:20 of speech; with the action pauses you'll land
around 2:45 — keep it **under 3:00**. Say the Amazon service names clearly. The middle
section ("first encounter / reunion") is the heart — slow down there.

---

**[0:00 — Dex grid / landing]**
"You can buy a painting at an auction. But you can't buy the first time you stood in front of it. ArtDex is built on that one idea: you don't collect the artwork — you collect the *moment* you and it shared. And every one of those moments lives in **Amazon DynamoDB**."

**[0:22 — Capture tab, live camera, frame The Starry Night, tap shutter]**
"Here's how it works. GPS finds my nearest museum, and DynamoDB returns only the works on display there *today*. So the AI on **Amazon Bedrock** matches my photo against just a handful of candidates — not the whole history of art. That's what makes it reliable."

**[0:46 — Match appears: The Starry Night, legendary celebration]**
"The Starry Night — a legendary. And legendaries are *earned, not bought*: DynamoDB only lets me collect it while I'm physically within 150 metres of the museum that holds it. Presence is the price."

**[1:06 — Hold to seal, polaroid develops]**
"I seal the moment. My selfie with the art goes to **Amazon S3**, and the capture — its time, its place, its coordinates — is appended to my record in DynamoDB."

**[1:24 — Open the work's detail / moment strip showing a gilded first + a reunion stamp]**
"And this is the heart of it. The first time I meet a work, it's gilded — a *first encounter*. You only ever get one. It can't be bought, and it can't be fast-forwarded — a billionaire and a student stand in front of the real Starry Night exactly once for the first time. Come back years later, and it's a *reunion* — a new stamp on the same painting, a different chapter of your life. First-encounter or reunion isn't a flag we store; DynamoDB computes it purely from the timestamps of your moments. So your collection isn't a list of pictures. It's the growing record of a lifetime of having been there."

**[2:00 — World map with the selfie pin, then per-artist progress]**
"Each moment pins to my world map — with my face, where the work actually was. An auction *ends* a relationship: the painting vanishes into a vault. ArtDex lets the relationship keep growing — the stamps stack up over a lifetime."

**[2:18 — AWS console: DynamoDB tables → a collections row with lat/lon → S3 objects]**
"And it's all real — live rows in **Amazon DynamoDB**, my moments with latitude and longitude, the keepsakes in **Amazon S3**."

**[2:38 — Close on logo / URL]**
"A database that isn't storage — it's a record of presence. ArtDex — collect the world's masterpieces. Built on Vercel and **Amazon DynamoDB**."

---

### How to *show* first-encounter vs reunion
- Open a work you've already collected → its **moment strip** shows the gilded **初遇 / first encounter** plus any **重逢 / reunion** stamps. Film that during the [1:24] beat.
- Or re-capture a work you already own — the match sheet says *"You're back — this will be a reunion,"* which is a great on-screen beat.

### Recording notes
- Desk demo: set `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"` (MoMA) so the legendary gate passes; frame a printout/screen of The Starry Night, or use the gallery button.
- Do the capture in **one unbroken take** (proves it's real); cut to the AWS console afterward.
- The judged criterion is database usage — note how the human idea *is* the data model: an **append-only list of moments**, with first/reunion **derived from `capturedAt`**, and the 150 m gate enforced against DynamoDB.
