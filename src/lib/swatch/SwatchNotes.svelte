<script>
  export let notes;

  console.log(notes)
</script>

<section>
  <h2>Artist Notes</h2>

  {#each notes as note}
    <div>
      <div class="note">
        <div class="initial">{note.author.displayName.substr(0,1)}</div>
        <div>
          {note.author?.displayName} {note.createdAt}
          <div>{@html note.content}</div>
        </div>
      </div>

      {#each note.childNotes as childNote}
        <div class="note reply">
          <div class="initial"><span>{childNote.author.displayName.substr(0,1)}</span></div>
          <div>
            {childNote.author.displayName} {childNote.createdAt}
            <div>{@html childNote.content}</div>
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
    display: flex;
  }

  .initial {
    background-color: rebeccapurple;
    color: white;
    border-radius: 100%;
    padding: 5px;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .initial span {
    display: block;
  }
  .reply {
    margin-left: 50px;
  }
</style>