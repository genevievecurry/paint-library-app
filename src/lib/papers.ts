export const key = {};

export async function fetchPapers(): Promise<Response> {
  console.log('fetchPapers()');
  const res = await fetch(`/model/paper.json`);

  if (res.ok) {
    return res.json();
  } else {
    // throw new Error('Failed to fetch the papers'); // Todo: do better
  }
}
