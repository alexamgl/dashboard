<?php
/**
 * This file is part of the Cloudinary PHP package.
 *
 * (c) Cloudinary
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Cloudinary\Transformation;

use Cloudinary\Transformation\Expression\Expression;

/**
 * Class Fill
 */
class Fill extends BaseResizeAction
{
    use FillTrait;
    use FocalGravityTrait;
    use PointTrait;

    /**
     * Fill constructor.
     *
     * @param string|CropMode       $cropMode
     * @param int|string|Expression $width
     * @param int|string|Expression $height
     * @param mixed|null            $gravity
     */
    public function __construct($cropMode, $width = null, $height = null, mixed $gravity = null)
    {
        parent::__construct($cropMode, $width, $height);

        $this->gravity($gravity);
    }


    /**
     * Internal setter for offset.
     *
     *
     * @return $this
     *
     * @internal
     */
    public function setPointValue(mixed $value): static
    {
        if (! isset($this->qualifiers[Point::getName()])) {
            $this->addQualifier(new Point());
        }

        $this->qualifiers[Point::getName()]->setPointValue($value);

        return $this;
    }
}
