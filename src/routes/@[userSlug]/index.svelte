<script context="module">
  export async function load({ page, fetch }) {
    return {
      status: 302,
      redirect: `/@${page.params.userSlug}/palettes`,
    };
  }
</script>
