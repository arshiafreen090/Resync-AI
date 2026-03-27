import xml.etree.ElementTree as ET
import os

svg_path = r"c:\Users\arshi\Desktop\ReSync AI\Inspo Asset\Logo Final.svg"
out_dir = r"c:\Users\arshi\Desktop\ReSync AI\assets"

tree = ET.parse(svg_path)
root = tree.getroot()
ns = {'svg': 'http://www.w3.org/2000/svg'}

paths = root.findall('svg:path', ns)

if len(paths) >= 5:
    path_white_icon = paths[0].attrib['d']
    path_white_text = paths[1].attrib['d']
    path_blue_icon = paths[2].attrib['d']
    path_blue_text = paths[3].attrib['d']
    path_standalone_icon = paths[4].attrib['d']

    # Favicon
    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="50 56 22 30" width="32" height="32">
      <path d="{path_standalone_icon}" fill="#015BDC"/>
    </svg>'''

    with open(os.path.join(out_dir, "favicon.svg"), "w") as f:
        f.write(favicon_svg)

    # White Logo -> logo-dark.svg
    logo_dark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="90 56 80 30">
      <path d="{path_white_icon}" fill="white"/>
      <path d="{path_white_text}" fill="white"/>
    </svg>'''

    with open(os.path.join(out_dir, "logo-dark.svg"), "w") as f:
        f.write(logo_dark_svg)

    # Blue Logo -> logo-light.svg
    logo_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="185 56 81 30">
      <path d="{path_blue_icon}" fill="#015BDC"/>
      <path d="{path_blue_text}" fill="#015BDC"/>
    </svg>'''

    with open(os.path.join(out_dir, "logo-light.svg"), "w") as f:
        f.write(logo_light_svg)

    print("Icons successfully exported with fixed viewBox!")
else:
    print("Error: Could not find 5 paths in SVG.")
