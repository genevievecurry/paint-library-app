<script context="module">
  export async function load({ params }) {
    return {
      status: 302,
      redirect: `/@${params.username}/palettes`,
    };
  }
</script>
