<script context="module" lang="ts">
  export async function load({ session, url }) {
    const { pathname } = url;
    if (session.user) {
      return {
        status: 302,
        redirect: '/',
      };
    }
    return {
      props: {
        pathname,
      },
    };
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { sendRequestAccountEmail } from '$lib/email';

  export let pathname;
  let email = '';
  let firstName = '';
  let message = '';

  $: accountRequest = {
    email: email,
    firstName: firstName,
    message: message,
  };

  async function submitHandler() {
    sendRequestAccountEmail(accountRequest);
  }
</script>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Request Account" {pathname} />

  <form on:submit|preventDefault={submitHandler}>
    <div class="grid lg:grid-cols-2 gap-12 xl:gap-32">
      <div>
        <fieldset class="form-group mt-3">
          <label for="message" class="block">Email</label>
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            bind:value={email} />
        </fieldset>
        <fieldset class="form-group mt-6">
          <label for="message" class="block">First Name</label>
          <input
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="firstName"
            name="firstName"
            type="firstName"
            required
            placeholder="First Name"
            bind:value={firstName} />
        </fieldset>
        <fieldset class="form-group mt-6">
          <label for="message" class="block">Reason for Request</label>
          <small
            class="leading-5 block mt-1 text-sm font-light text-gray-500 mb-3">
            Please provide a brief description of why you would like access to
            the Paint Library.
          </small>
          <textarea
            class="mt-1 block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
            id="message"
            name="message"
            rows="5"
            required
            placeholder="Reason for Request"
            bind:value={message} />
        </fieldset>
        <div class="mt-6 py-3 flex justify-between border-t border-black">
          <button
            type="submit"
            class="pop px-6 py-2 text-2xl hover:text-pink-500">
            Request
          </button>
        </div>
      </div>
      <div class="prose">
        <blockquote>
          <p
            >Since this website is still in development, I'm only allowing a
            limited number of user accounts. I will review your request and send
            you an email.
          </p>
          <cite>- @librarian</cite>
        </blockquote>

        <h4>An account will let you:</h4>
        <ul>
          <li>Add watercolor swatches to paints.</li>
          <li>Add your own notes/insights about paints.</li>
          <li
            >Create public or private palettes with your paint collections, or
            use them as aspirational collections of paints you want to try.</li>
          <li>Save other users' palettes.</li>
        </ul>

        <h4>An account <u>will not</u> let you:</h4>
        <ul>
          <li>Add new paints to the library.</li>
          <li
            >Update paint data (like the description, name, qualities, or
            pigments)</li>
          <li>Add new pigments to the library.</li>
          <li>Update pigment data.</li>
        </ul>

        <p
          >If you are interested in helping keep the database up to date, please
          mention that in the request form! Thank you :)
        </p>
      </div>
    </div>
  </form>
</div>
