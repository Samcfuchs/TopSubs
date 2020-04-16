function getNames(comments) {
    return comments.map((c) => c.subreddit.display_name)
}

function counter(array) {
    let set = new Set(array)
    let counts = {}

    set.forEach(function(key) {
        n = 0
        array.forEach(function(name) { n += key == name; });

        counts[key] = n
    });
    return counts
}

function sort(object) {
    var sortable = []
    for (var sub in object) {
        sortable.push([sub, object[sub]]);
    }

    sortable.sort(function(a,b) {
        return -1 * (a[1] - b[1])
    });

    return sortable
}

async function getSubs(r, username, n_subs, n_comments) {
    return r.getUser(username).getComments({limit: n_comments})
        .then(getNames)
        .then(counter)
        .then(sort)
        .then((d) => d.slice(0,n_subs));
}

const HEIGHT = 200
const WIDTH = 600
const margin = { top: 10, bottom: 30, left: 100, right: 10 }

svg = d3.select('body').append('svg')
    .attr('height', HEIGHT)
    .attr('width', WIDTH);

username = 'hoodedgryphon'

d3.json('oauth.json')
    .then(json => new snoowrap(json))
    .then(snoo => getSubs(snoo, username, 5, 100))
    .then(data => draw(data));

function draw(data) {
    labels = data.map((d) => d[0]);
    counts = data.map((d) => d[1]);

    x_scale = d3.scaleLinear()
        .domain([0, counts[0] * 1.10])
        .range([margin.left, WIDTH-margin.right]);

    y_scale = d3.scaleBand()
        .domain(labels)
        .range([margin.top, HEIGHT-margin.bottom]);

    svg.append("g")
        .attr("transform", `translate(0,${HEIGHT - margin.bottom})`)
        .call(d3.axisBottom(x_scale));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_scale));
    
    svg.append("g")
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(data)
        .join('rect')
            .attr('x', d => x_scale(0))
            .attr('y', d => y_scale(d[0]))
            .attr('height', d => y_scale.bandwidth())
            .attr('width', d => x_scale(d[1]) - x_scale(0));
}

