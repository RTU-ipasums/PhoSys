import matplotlib as mpl
mpl.use('svg')  # or whatever other backend that you want
import matplotlib.pyplot as plt

import fdtd
import mpld3
import fdtd.backend as bd

ZMAX = 1

fdtd.set_backend("numpy")
#fdtd.set_backend("torch.float32")

WAVELENGTH = 1550e-9
SPEED_LIGHT: float = 299_792_458.0

def visualize(
    grid,
    x=None,
    y=None,
    z=None,
    cmap="Blues",
    pbcolor="C3",
    pmlcolor=(0, 0, 0, 0.1),
    objcolor=(1, 0, 0, 0.1),
    srccolor="C0",
    detcolor="C2",
    norm="linear",
    show=False,  # default False to allow animate to be true
    animate=False,  # True to see frame by frame states of grid while running simulation
    index=None,  # index for each frame of animation (visualize fn runs in a loop, loop variable is passed as index)
    save=False,  # True to save frames (requires parameters index, folder)
    folder=None,  # folder path to save frames
):
    """visualize a projection of the grid and the optical energy inside the grid
    Args:
        x: the x-value to make the yz-projection (leave None if using different projection)
        y: the y-value to make the zx-projection (leave None if using different projection)
        z: the z-value to make the xy-projection (leave None if using different projection)
        cmap: the colormap to visualize the energy in the grid
        pbcolor: the color to visualize the periodic boundaries
        pmlcolor: the color to visualize the PML
        objcolor: the color to visualize the objects in the grid
        srccolor: the color to visualize the sources in the grid
        detcolor: the color to visualize the detectors in the grid
        norm: how to normalize the grid_energy color map ('linear' or 'log').
        show: call pyplot.show() at the end of the function
        animate: see frame by frame state of grid during simulation
        index: index for each frame of animation (typically a loop variable is passed)
        save: save frames in a folder
        folder: path to folder to save frames
    """

    fig = plt.figure()
    plt.figure().clear()
    plt.close()
    plt.cla()
    plt.clf()

    if norm not in ("linear", "lin", "log"):
        raise ValueError("Color map normalization should be 'linear' or 'log'.")
    # imports (placed here to circumvent circular imports)
    from fdtd.sources import PointSource, LineSource, PlaneSource
    from fdtd.boundaries import _PeriodicBoundaryX, _PeriodicBoundaryY, _PeriodicBoundaryZ
    from fdtd.boundaries import (
        _PMLXlow,
        _PMLXhigh,
        _PMLYlow,
        _PMLYhigh,
        _PMLZlow,
        _PMLZhigh,
    )
    import matplotlib.patches as ptc

    if animate:  # pause for 0.1s, clear plot
        plt.pause(0.02)
        plt.clf()
        plt.ion()  # ionteration on for animation effect

    # validate x, y and z
    if x is not None:
        if not isinstance(x, int):
            raise ValueError("the `x`-location supplied should be a single integer")
        if y is not None or z is not None:
            raise ValueError(
                "if an `x`-location is supplied, one should not supply a `y` or a `z`-location!"
            )
    elif y is not None:
        if not isinstance(y, int):
            raise ValueError("the `y`-location supplied should be a single integer")
        if z is not None or x is not None:
            raise ValueError(
                "if a `y`-location is supplied, one should not supply a `z` or a `x`-location!"
            )
    elif z is not None:
        if not isinstance(z, int):
            raise ValueError("the `z`-location supplied should be a single integer")
        if x is not None or y is not None:
            raise ValueError(
                "if a `z`-location is supplied, one should not supply a `x` or a `y`-location!"
            )
    else:
        raise ValueError(
            "at least one projection plane (x, y or z) should be supplied to visualize the grid!"
        )

    # just to create the right legend entries:
    plt.plot([], lw=7, color=objcolor, label="Objects")
    plt.plot([], lw=7, color=pmlcolor, label="PML")
    plt.plot([], lw=3, color=pbcolor, label="Periodic Boundaries")
    plt.plot([], lw=3, color=srccolor, label="Sources")
    plt.plot([], lw=3, color=detcolor, label="Detectors")

    # Grid energy
    grid_energy = bd.sum(grid.E ** 2 + grid.H ** 2, -1)
    if x is not None:
        assert grid.Ny > 1 and grid.Nz > 1
        xlabel, ylabel = "y", "z"
        Nx, Ny = grid.Ny, grid.Nz
        pbx, pby = _PeriodicBoundaryY, _PeriodicBoundaryZ
        pmlxl, pmlxh, pmlyl, pmlyh = _PMLYlow, _PMLYhigh, _PMLZlow, _PMLZhigh
        grid_energy = grid_energy[x, :, :]
    elif y is not None:
        assert grid.Nx > 1 and grid.Nz > 1
        xlabel, ylabel = "z", "x"
        Nx, Ny = grid.Nz, grid.Nx
        pbx, pby = _PeriodicBoundaryZ, _PeriodicBoundaryX
        pmlxl, pmlxh, pmlyl, pmlyh = _PMLZlow, _PMLZhigh, _PMLXlow, _PMLXhigh
        grid_energy = grid_energy[:, y, :].T
    elif z is not None:
        assert grid.Nx > 1 and grid.Ny > 1
        xlabel, ylabel = "x", "y"
        Nx, Ny = grid.Nx, grid.Ny
        pbx, pby = _PeriodicBoundaryX, _PeriodicBoundaryY
        pmlxl, pmlxh, pmlyl, pmlyh = _PMLXlow, _PMLXhigh, _PMLYlow, _PMLYhigh
        grid_energy = grid_energy[:, :, z]
    else:
        raise ValueError("Visualization only works for 2D grids")

    for source in grid.sources:
        if isinstance(source, LineSource):
            if x is not None:
                _x = [source.y[0], source.y[-1]]
                _y = [source.z[0], source.z[-1]]
            elif y is not None:
                _x = [source.z[0], source.z[-1]]
                _y = [source.x[0], source.x[-1]]
            elif z is not None:
                _x = [source.x[0], source.x[-1]]
                _y = [source.y[0], source.y[-1]]
            plt.plot(_y, _x, lw=3, color=srccolor)
        elif isinstance(source, PointSource):
            if x is not None:
                _x = source.y
                _y = source.z
            elif y is not None:
                _x = source.z
                _y = source.y
            elif z is not None:
                _x = source.x
                _y = source.y
            plt.plot(_y - 0.5, _x - 0.5, lw=3, marker="o", color=srccolor)
            grid_energy[_x, _y] = 0  # do not visualize energy at location of source
        elif isinstance(source, PlaneSource):
            if x is not None:
                _x = (
                    source.y
                    if source.y.stop > source.y.start + 1
                    else slice(source.y.start, source.y.start)
                )
                _y = (
                    source.z
                    if source.z.stop > source.z.start + 1
                    else slice(source.z.start, source.z.start)
                )
            elif y is not None:
                _x = (
                    source.z
                    if source.z.stop > source.z.start + 1
                    else slice(source.z.start, source.z.start)
                )
                _y = (
                    source.x
                    if source.x.stop > source.x.start + 1
                    else slice(source.x.start, source.x.start)
                )
            elif z is not None:
                _x = (
                    source.x
                    if source.x.stop > source.x.start + 1
                    else slice(source.x.start, source.x.start)
                )
                _y = (
                    source.y
                    if source.y.stop > source.y.start + 1
                    else slice(source.y.start, source.y.start)
                )
            patch = ptc.Rectangle(
                xy=(_y.start - 0.5, _x.start - 0.5),
                width=_y.stop - _y.start,
                height=_x.stop - _x.start,
                linewidth=0,
                edgecolor="none",
                facecolor=srccolor,
            )
            plt.gca().add_patch(patch)

    # Detector
    for detector in grid.detectors:
        if x is not None:
            _x = [detector.y[0], detector.y[-1]]
            _y = [detector.z[0], detector.z[-1]]
        elif y is not None:
            _x = [detector.z[0], detector.z[-1]]
            _y = [detector.x[0], detector.x[-1]]
        elif z is not None:
            _x = [detector.x[0], detector.x[-1]]
            _y = [detector.y[0], detector.y[-1]]

        if detector.__class__.__name__ == "BlockDetector":
            # BlockDetector
            plt.plot(
                [_y[0], _y[1], _y[1], _y[0], _y[0]],
                [_x[0], _x[0], _x[1], _x[1], _x[0]],
                lw=3,
                color=detcolor,
            )
        else:
            # LineDetector
            plt.plot(_y, _x, lw=3, color=detcolor)

    # Boundaries
    for boundary in grid.boundaries:
        if isinstance(boundary, pbx):
            _x = [-0.5, -0.5, float("nan"), Nx - 0.5, Nx - 0.5]
            _y = [-0.5, Ny - 0.5, float("nan"), -0.5, Ny - 0.5]
            plt.plot(_y, _x, color=pbcolor, linewidth=3)
        elif isinstance(boundary, pby):
            _x = [-0.5, Nx - 0.5, float("nan"), -0.5, Nx - 0.5]
            _y = [-0.5, -0.5, float("nan"), Ny - 0.5, Ny - 0.5]
            plt.plot(_y, _x, color=pbcolor, linewidth=3)
        elif isinstance(boundary, pmlyl):
            patch = ptc.Rectangle(
                xy=(-0.5, -0.5),
                width=boundary.thickness,
                height=Nx,
                linewidth=0,
                edgecolor="none",
                facecolor=pmlcolor,
            )
            plt.gca().add_patch(patch)
        elif isinstance(boundary, pmlxl):
            patch = ptc.Rectangle(
                xy=(-0.5, -0.5),
                width=Ny,
                height=boundary.thickness,
                linewidth=0,
                edgecolor="none",
                facecolor=pmlcolor,
            )
            plt.gca().add_patch(patch)
        elif isinstance(boundary, pmlyh):
            patch = ptc.Rectangle(
                xy=(Ny - 0.5 - boundary.thickness, -0.5),
                width=boundary.thickness,
                height=Nx,
                linewidth=0,
                edgecolor="none",
                facecolor=pmlcolor,
            )
            plt.gca().add_patch(patch)
        elif isinstance(boundary, pmlxh):
            patch = ptc.Rectangle(
                xy=(-0.5, Nx - boundary.thickness - 0.5),
                width=Ny,
                height=boundary.thickness,
                linewidth=0,
                edgecolor="none",
                facecolor=pmlcolor,
            )
            plt.gca().add_patch(patch)

    for obj in grid.objects:
        if x is not None:
            _x = (obj.y.start, obj.y.stop)
            _y = (obj.z.start, obj.z.stop)
        elif y is not None:
            _x = (obj.z.start, obj.z.stop)
            _y = (obj.x.start, obj.x.stop)
        elif z is not None:
            _x = (obj.x.start, obj.x.stop)
            _y = (obj.y.start, obj.y.stop)

        patch = ptc.Rectangle(
            xy=(min(_y) - 0.5, min(_x) - 0.5),
            width=max(_y) - min(_y),
            height=max(_x) - min(_x),
            linewidth=0,
            edgecolor="none",
            facecolor=objcolor,
        )
        plt.gca().add_patch(patch)

    # visualize the energy in the grid
    cmap_norm = None
    if norm == "log":
        cmap_norm = LogNorm(vmin=1e-4, vmax=grid_energy.max() + 1e-4)
    plt.imshow(bd.numpy(grid_energy), cmap=cmap, interpolation="sinc", norm=cmap_norm)

    # finalize the plot
    plt.ylabel(xlabel)
    plt.xlabel(ylabel)
    plt.ylim(Nx, -1)
    plt.xlim(-1, Ny)
    plt.figlegend()
    plt.tight_layout()

    return plt.gcf()

def processJson(inJson):
    try:
        WAVELENGTH = inJson['wavelength']
    except KeyError:
        WAVELENGTH = 1550e-9
    try:
        xOut, yOut = inJson['xOut'], inJson['yOut']
    except KeyError:
        xOut, yOut = 500, 500

    grid = fdtd.Grid(
        (inJson['xBounds'], inJson['yBounds'], ZMAX),#(2.5e-5, 1.5e-5, 1),
        grid_spacing=0.1 * WAVELENGTH,
        permittivity=1.0,
        permeability=1.0,
    )
    
    #grid[0, :, :] = fdtd.PeriodicBoundary(name="xbounds")
    #grid[0:50, :, :] = fdtd.PML(name="pml_xlow")
    #grid[-50:, :, :] = fdtd.PML(name="pml_xhigh")

    #grid[:, 0, :] = fdtd.PeriodicBoundary(name="ybounds")
    #grid[:, 0:50, :] = fdtd.PML(name="pml_ylow")
    #rid[:, -50:, :] = fdtd.PML(name="pml_yhigh")
    grid[:, :, 0] = fdtd.PeriodicBoundary(name="zbounds")

    for obj in inJson['rectangles']+inJson['circles']:
        match obj['name'].split('_')[0]:
            case 'object':
                grid[int(obj['x']):int(obj['x'])+int(obj['scaleX']*obj['width']), int(obj['y']):int(obj['y']+obj['scaleY']*obj['height']), 0:ZMAX] = fdtd.AnisotropicObject(permittivity=2.5, name=obj['name'])
            case 'linesource':
                grid[int(obj['points'][0]):int(obj['points'][2]), int(obj['points'][1]):int(obj['points'][3]), 0] = fdtd.LineSource(period=WAVELENGTH / SPEED_LIGHT, name=obj['name'])
            case 'pointsource':
                grid[int(obj['x']), int(obj['y']), 0] = fdtd.PointSource(period=WAVELENGTH / SPEED_LIGHT, amplitude=10.0, name=obj['name'])


    grid.run(50, progress_bar=False)
    
    plt.autoscale() 
    fig = visualize(grid, z=0)
    figSize = fig.get_size_inches()*fig.dpi
    fig.set_figwidth(inJson['xBounds']/figSize[0]*fig.get_size_inches()[0])
    fig.set_figheight(inJson['yBounds']/figSize[1]*fig.get_size_inches()[1])


    return mpld3.fig_to_dict(fig)

def test_fdtd():

    grid = fdtd.Grid(
        (2.5e-5, 1.5e-5, 1),
        grid_spacing=0.1 * WAVELENGTH,
        permittivity=1.0,
        permeability=1.0,
    )

    # grid[0, :, :] = fdtd.PeriodicBoundary(name="xbounds")
    grid[0:10, :, :] = fdtd.PML(name="pml_xlow")
    grid[-10:, :, :] = fdtd.PML(name="pml_xhigh")

    # grid[:, 0, :] = fdtd.PeriodicBoundary(name="ybounds")
    grid[:, 0:10, :] = fdtd.PML(name="pml_ylow")
    grid[:, -10:, :] = fdtd.PML(name="pml_yhigh")

    grid[:, :, 0] = fdtd.PeriodicBoundary(name="zbounds")

    grid[50:55, 70:75, 0] = fdtd.LineSource(
        period=WAVELENGTH / SPEED_LIGHT, name="linesource"
    )
    grid[100, 60, 0] = fdtd.PointSource(
        period=WAVELENGTH / SPEED_LIGHT, name="pointsource",
    )

    grid[11:32, 30:84, 0:1] = fdtd.AnisotropicObject(permittivity=2.5, name="object")

    grid[12e-6, :, 0] = fdtd.LineDetector(name="detector")

    grid.run(50, progress_bar=False)

    '''fig, axes = plt.subplots(2, 3, squeeze=False)
    titles = ["Ex: xy", "Ey: xy", "Ez: xy", "Hx: xy", "Hy: xy", "Hz: xy"]

    fields = bd.stack(
        [
            grid.E[:, :, 0, 0],
            grid.E[:, :, 0, 1],
            grid.E[:, :, 0, 2],
            grid.H[:, :, 0, 0],
            grid.H[:, :, 0, 1],
            grid.H[:, :, 0, 2],
        ]
    )

    m = max(abs(fields.min().item()), abs(fields.max().item()))
    
    for ax, field, title in zip(axes.ravel(), fields, titles):
        ax.set_axis_off()
        ax.set_title(title)
        ax.imshow(bd.numpy(field), vmin=-m, vmax=m, cmap="RdBu")'''

    return mpld3.fig_to_dict(visualize(grid, z=0, show=False))