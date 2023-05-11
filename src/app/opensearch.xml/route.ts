import { Buffer } from 'node:buffer';

export async function GET(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const domain = `${protocol}://${host}`;
  const xmlString = `
  <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
    xmlns:moz="http://www.mozilla.org/2006/browser/search/">
    <ShortName>Hashnode</ShortName>
    <Description>Find posts from the Hashnode network</Description>
    <InputEncoding>[UTF-8]</InputEncoding>
    <Image width="16" height="16" type="image/png">https://cdn.hashnode.com/res/hashnode/image/upload/v1593161575096/TqLsQ-OdB.png?auto=compress</Image>
    <Url type="text/html" template="${domain}/search?q={searchTerms}"/>
  </OpenSearchDescription>
  `.trim();
  return new Response(xmlString, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(xmlString)),
    },
  });
}
