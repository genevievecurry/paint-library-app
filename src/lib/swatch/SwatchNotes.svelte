<script>
  export let notes;
</script>

<section>
  <h2>Artist Notes</h2>

  
  {#each notes as note}
    <div>
      <div class="note">
        <div>{note.author.initial}</div>
        <div>
          {note.author.display_name} {note.date}
          {@html note.body}
        </div>
      </div>
      {#each note.replies as reply}
        <div class="note reply">
          <div>{reply.author.initial}</div>
          <div>
            {reply.author.display_name} {reply.date}
            {@html reply.body}
          </div>
        </div>
      {/each}
    </div>
  {/each}
</section>

<style>
  .note {
    border: 1px solid #000;
    padding: 10px;
    margin: 10px;
  }
  .reply {
    margin-left: 50px;
  }
</style>