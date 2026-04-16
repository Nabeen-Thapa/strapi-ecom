import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'footer';
  };
  attributes: {
    description: Schema.Attribute.Text;
    link: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'header';
  };
  attributes: {
    description: Schema.Attribute.Text;
    logo: Schema.Attribute.Component<'shared.logo', true>;
    navItems: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    displayName: 'address';
    icon: 'envelop';
  };
  attributes: {
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    houseNunber: Schema.Attribute.String;
    state: Schema.Attribute.String;
    tole: Schema.Attribute.String;
  };
}

export interface SharedDiscount extends Struct.ComponentSchema {
  collectionName: 'components_shared_discounts';
  info: {
    displayName: 'discount';
  };
  attributes: {
    discountExpiresAt: Schema.Attribute.DateTime;
    discountType: Schema.Attribute.Enumeration<['percentage', 'fixed']>;
    discountValue: Schema.Attribute.BigInteger;
    isDiscountActive: Schema.Attribute.Boolean;
  };
}

export interface SharedLaptopSpecifications extends Struct.ComponentSchema {
  collectionName: 'components_shared_laptop_specifications';
  info: {
    displayName: 'LaptopSpecifications';
  };
  attributes: {
    audioFeatures: Schema.Attribute.String;
    batteryType: Schema.Attribute.String;
    battry: Schema.Attribute.String;
    colors: Schema.Attribute.Enumeration<
      ['silver', 'sky blue', 'midnight', 'starlight']
    >;
    displaySize: Schema.Attribute.String;
    fingerprintSensor: Schema.Attribute.String;
    gpu: Schema.Attribute.String;
    operatingSystem: Schema.Attribute.String;
    processor: Schema.Attribute.String;
    ram: Schema.Attribute.String;
    series: Schema.Attribute.String;
    storage: Schema.Attribute.String;
    storageType: Schema.Attribute.Enumeration<['SSD', 'HDD']>;
    USBType: Schema.Attribute.String;
    warrantyDetails: Schema.Attribute.String;
    weight: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    isButton: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_logos';
  info: {
    displayName: 'logo';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    link: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMetaDescription extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_descriptions';
  info: {
    displayName: 'metaDescription';
    icon: 'layer';
  };
  attributes: {
    description: Schema.Attribute.Text;
  };
}

export interface SharedMetaTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_titles';
  info: {
    displayName: 'metaTitle';
    icon: 'apps';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface SharedPriceInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_price_infos';
  info: {
    displayName: 'price-info';
    icon: 'archive';
  };
  attributes: {
    discountPrecent: Schema.Attribute.Decimal;
    isDiscount: Schema.Attribute.Boolean;
    price: Schema.Attribute.Decimal;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'shared.address': SharedAddress;
      'shared.discount': SharedDiscount;
      'shared.laptop-specifications': SharedLaptopSpecifications;
      'shared.link': SharedLink;
      'shared.logo': SharedLogo;
      'shared.media': SharedMedia;
      'shared.meta-description': SharedMetaDescription;
      'shared.meta-title': SharedMetaTitle;
      'shared.price-info': SharedPriceInfo;
      'shared.seo': SharedSeo;
    }
  }
}
