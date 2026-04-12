import xml.etree.ElementTree as ET
import os
import re

svg_path = r"c:\Users\arshi\Desktop\ReSync AI\Inspo Asset\Logo Final.svg"
out_dir = r"c:\Users\arshi\Desktop\ReSync AI\assets"

tree = ET.parse(svg_path)
root = tree.getroot()
ns = {'svg': 'http://www.w3.org/2000/svg'}

paths = root.findall('svg:path', ns)

# Inspection based on Logo Final.svg:
# paths[0]: White Icon 
# paths[1]: White Text
# paths[2]: Blue Icon
# paths[3]: Blue Text
# paths[4]: Standalone Blue Icon

path_white_icon = paths[0].attrib['d']
path_white_text = paths[1].attrib['d']
path_blue_icon = paths[2].attrib['d']
path_blue_text = paths[3].attrib['d']
path_standalone_icon = paths[4].attrib['d']

def get_bounds(d_str):
    nums = [float(x) for x in re.findall(r'-?\d+\.\d+|-?\d+', d_str)]
    xs = nums[::2]
    ys = nums[1::2]
    return min(xs), min(ys), max(xs), max(ys)

# Favicon
min_x, min_y, max_x, max_y = get_bounds(path_standalone_icon)
w = max_x - min_x
h = max_y - min_y
margin = 4
vbox_favicon = f"{min_x - margin} {min_y - margin} {w + margin*2} {h + margin*2}"

favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbox_favicon}" width="32" height="32">
  <path d="{path_standalone_icon}" fill="#015BDC"/>
</svg>'''

with open(os.path.join(out_dir, "favicon.svg"), "w") as f:
    f.write(favicon_svg)

# White Logo -> logo-dark.svg
mix1, miy1, max1, may1 = get_bounds(path_white_icon)
mix2, miy2, max2, may2 = get_bounds(path_white_text)
lw_minx = min(mix1, mix2)
lw_miny = min(miy1, miy2)
lw_maxx = max(max1, max2)
lw_maxy = max(may1, may2)
lw_w = lw_maxx - lw_minx
lw_h = lw_maxy - lw_miny

vbox_logo_white = f"{lw_minx} {lw_miny} {lw_w} {lw_h}"

logo_dark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbox_logo_white}">
  <path d="{path_white_icon}" fill="white"/>
  <path d="{path_white_text}" fill="white"/>
</svg>'''

with open(os.path.join(out_dir, "logo-dark.svg"), "w") as f:
    f.write(logo_dark_svg)

# Blue Logo -> logo-light.svg
mix3, miy3, max3, may3 = get_bounds(path_blue_icon)
mix4, miy4, max4, may4 = get_bounds(path_blue_text)
lb_minx = min(mix3, mix4)
lb_miny = min(miy3, miy4)
lb_maxx = max(max3, max4)
lb_maxy = max(may3, may4)
lb_w = lb_maxx - lb_minx
lb_h = lb_maxy - lb_miny

vbox_logo_blue = f"{lb_minx} {lb_miny} {lb_w} {lb_h}"

logo_light_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbox_logo_blue}">
  <path d="{path_blue_icon}" fill="#015BDC"/>
  <path d="{path_blue_text}" fill="#015BDC"/>
</svg>'''

with open(os.path.join(out_dir, "logo-light.svg"), "w") as f:
    f.write(logo_light_svg)

print("Icons exported successfully!")
