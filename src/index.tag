<awesome-tag>
  <div class="list-container">
    <ul class="list-group">
      <li class="list-group-item" each={ collection }>
        { title }
      </li>
    </ul>
  </div>


  <script>
    const tag = this;
    tag.collection = opts.collection;
  </script>

  <style>
    awesome-tag {
      display: flex;
      justify-content: center;
    }

    .list-container {
      width: 40%;
    }
  </style>
</awesome-tag>