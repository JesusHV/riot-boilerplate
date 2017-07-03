/* globals riot, $, expect  */

// Initialize own tag

describe('Test', () => {
  const opts = {
    collection: [{
      title: 'Item 1'
    }, {
      title: 'Item 2'
    },{
      title: 'Item 3'
    },{
      title: 'Item 4'
    },{
      title: 'Item 5'
    }]
  };

  before(() => {
    riot.mount('awesome-tag', opts);
  });

  it('test awesome', (done) => {
    var items = document.querySelectorAll('.list-group-item').length;
    expect(items).to.be.equal(opts.collection.length);
    done();
  });
});
