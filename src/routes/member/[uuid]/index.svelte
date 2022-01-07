<script context="module">
  export async function load({ params, fetch }) {
    const url = `/member/${params.uuid}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        status: 302,
        redirect: `/member/${params.uuid}/${response.slug}/palettes`,
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>
