<script>
    export let toggleMenu;
    export let open = false;
</script>

<button on:click={toggleMenu} class="button" aria-label="open menu">
    <span class="bar" class:x={open}></span>
    <span class="bar" class:x={open}></span>
    <span class="bar" class:x={open}></span>
</button>

<style>
    .button {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 4em;
        width: 4em;
        background-color: #333;
        padding: 1rem;
        border: 0;
    }

    .button .bar {
        height: 0.2em;
        width: 100%;
        background-color: #ddd;
        transition: all 100ms ease-in-out;
    }

    .button:hover {
        cursor: pointer;
    }

    .x:nth-of-type(1) {
        transition: all 100ms ease-in-out;
        transform: rotate(45deg);
        transform-origin: top left;
        width: 28px;
    }

    .x:nth-of-type(2) {
        transition: all 100ms ease-in-out;
        transform-origin: center;
        width: 0;
    }

    .x:nth-of-type(3) {
        transition: all 100ms ease-in-out;
        transform: rotate(-45deg);
        transform-origin: bottom left;
        width: 28px;
    }
</style>
