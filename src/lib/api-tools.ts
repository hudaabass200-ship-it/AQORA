export async function getEgyptAquacultureProduction() {
  try {
    const res = await fetch("https://api.worldbank.org/v2/country/EGY/indicator/ER.FSH.AQUA.MT?format=json");
    const data = await res.json();
    if (data && data[1]) {
      const latestRecord = data[1].find((record: any) => record.value !== null);
      if (latestRecord) {
        return { year: latestRecord.date, production_metric_tons: latestRecord.value };
      }
    }
    return { error: "No data found" };
  } catch (e: any) {
    return { error: "Failed to fetch data: " + e.message };
  }
}

export async function getFishTaxonomy(speciesName: string) {
  try {
    const res = await fetch(`https://api.gbif.org/v1/species/match?name=${encodeURIComponent(speciesName)}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    
    if (data.matchType === "NONE") {
      return { error: `Species '${speciesName}' not found in Fish Species API.` };
    }
    
    return {
      common_name_searched: speciesName,
      scientific_name: data.scientificName,
      kingdom: data.kingdom,
      phylum: data.phylum,
      class: data.class,
      order: data.order,
      family: data.family,
      genus: data.genus,
      source: "Fish Species API"
    };
  } catch (e: any) {
    return { error: "Failed to fetch from Fish Species API: " + e.message };
  }
}

export async function getFishSpeciesInfo(speciesName: string) {
  try {
    const res = await fetch("https://www.fishwatch.gov/api/species");
    const data = await res.json();
    const found = data.find((f: any) => f['Species Name'].toLowerCase().includes(speciesName.toLowerCase()));
    if (found) {
      return {
        name: found['Species Name'],
        scientific_name: found['Scientific Name'],
        protein: found['Protein'],
        calories: found['Calories'],
        habitat: found['Habitat'],
        harvest_type: found['Harvest Type'],
        source: "FishWatch API"
      };
    }
    return { error: `Species '${speciesName}' not found in FishWatch API. Try using getFishTaxonomy instead.` };
  } catch (e: any) {
    return { error: "Failed to fetch data from FishWatch API: " + e.message };
  }
}
