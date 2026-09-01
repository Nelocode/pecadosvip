import SyntheticPreviewPage from '../(legacy)/preview-local-sintetico/page';

export default function ReleaseHoldingPage(props?: any) {
  const searchParams = props?.searchParams ?? Promise.resolve({});
  return <SyntheticPreviewPage searchParams={searchParams} {...props} />;
}
