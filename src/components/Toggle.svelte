<script>
    export let label = "";
    export let checked = false;
</script>

<label class="switch">
    <span class="slider-label">{label}</span>
    <input type="checkbox" bind:checked/>
    <span class="slider round"></span>
</label>

<style>
    .switch {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 1.2em;
    }
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider-label{
        margin-left: 3em;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 2.5em;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 0.8em;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 1em;
        width: 1em;
        left: 0.1em;
        bottom: 0.1em;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 50%;
    }
    input:checked + .slider {
        background-color: #2196f3;
    }
    input:checked + .slider:before {
        transform: translateX(1.2em);
    }
</style>
