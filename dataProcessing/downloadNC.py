from ftplib import FTP
from pathlib import Path
import datetime
# import xarray as xr
# import matplotlib.pyplot as plt
# import cmocean.cm as cm
# import numpy as np
# import cartopy.crs as ccrs
# # import cartopy.feature as cfeature
# import cartopy.io.img_tiles as cimgt
# import glob
## Get the data from ftp sites

#ftp://ftp.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/5km/v3.1_op/nc/v1.0/daily/ssta/
today = datetime.datetime.utcnow().date()

yesterday = today - datetime.timedelta(days=1)
yesterday = yesterday.strftime("%Y%m%d")


ftp = FTP("ftp.star.nesdis.noaa.gov")
ftp.login()
ftp.cwd('pub/sod/mecb/crw/data/5km/v3.1_op/nc/v1.0/daily/ssta/2022')
fileAnomaly = 'ct5km_ssta_v3.1_{}.nc'.format(yesterday)
script_path = Path(__file__).parent
print(script_path)
ftp.retrbinary(f'RETR {fileAnomaly}', open(str(Path(r'/Users/mathewbrown/Projects/mhw_images/ssta/dataProcessing') / fileAnomaly), 'wb').write)

# MHW Category
#ftp://ftp.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/marine_heatwave/v1.0.1/category/nc/


ftp = FTP("ftp.star.nesdis.noaa.gov")
ftp.login()
ftp.cwd('pub/sod/mecb/crw/data/marine_heatwave/v1.0.1/category/nc/2022')
fileHW= "noaa-crw_mhw_v1.0.1_category_{}.nc".format(yesterday)
script_path = Path(__file__).parent
print(script_path)
ftp.retrbinary(f'RETR {fileHW}', open(rf'{fileHW}', 'wb').write)


## Create the images
# import xarray as xr
# import matplotlib.pyplot as plt
# import cmocean.cm as cm
# import numpy as np
# import cartopy.crs as ccrs
# # import cartopy.feature as cfeature
# import cartopy.io.img_tiles as cimgt
# import glob