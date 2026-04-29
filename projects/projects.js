import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

let query = '';

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector('.projects-title');
title.textContent = `${projects.length} Projects`;

let searchInput = document.querySelector('.searchBar');
let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  let newSVG = d3.select('#projects-pie-plot');
  newSVG.selectAll('path').remove();
  
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  let newRolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  let newData = newRolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let sliceGenerator = d3.pie().value(d => d.value);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let newArcData = sliceGenerator(newData);
  let newArcs = newArcData.map(d => arcGenerator(d));

  let svg = d3.select('svg');

  newArcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', `arc-${i}`)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
        } else {
          const filteredProjects = projects.filter(
            (project) => project.year === newData[selectedIndex].label
          );
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

    let newLegend = d3.select('.legend');
    newData.forEach((d, i) => {
    newLegend
        .append('li')
        .attr('class', `legend-item`)
        .attr('style', `--color:${colors(i)}`)
        .classed('selected', selectedIndex === i)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        .style('cursor', 'pointer')
        .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        renderPieChart(projectsGiven);

        d3.selectAll('path')
            .attr('fill', (_, idx) => selectedIndex === idx ? 'oklch(60% 45% 0)' : colors(idx))
            .classed('selected', (_, idx) => selectedIndex === idx);

        d3.selectAll('.legend-item')
            .classed('selected', (_, idx) => selectedIndex === idx); 
        });
    });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});